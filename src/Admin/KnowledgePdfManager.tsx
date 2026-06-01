import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useId,
  useState,
  useEffect,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  LoaderCircle,
  UploadCloud,
  Trash2,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";
type KnowledgePdfManagerProps = {
  dashedBorder: string;
};

type SignatureResponse = {
  message: string;
  success: boolean;
  data?: {
    timestamp: number;
    signature: string;
    cloudName: string;
    apiKey: string;
    folder?: string;
  };
};

type CloudinaryUploadResponse = {
  secure_url: string;
  original_filename?: string;
  bytes: number;
  public_id: string;
};

type BackendUploadResponse = {
  success: boolean;
  message: string;
};

type UploadedAsset = {
  secureUrl: string;
  originalFilename?: string;
  bytes?: number;
  publicId: string;
};

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

const formatBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const payload = await response.json();
    if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
    ) {
      return payload.message;
    }
    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      payload.error &&
      typeof payload.error === "object" &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
    ) {
      return payload.error.message;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
};

const KnowledgePdfManager = ({ dashedBorder }: KnowledgePdfManagerProps) => {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(
    null,
  );

  useEffect(() => {
    const fetchCurrentPdf = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/uploads/knowledge-pdf`, {
          method: "GET",
        });
        if (response.ok) {
          const payload = await response.json();
          if (payload.success && payload.data) {
            setUploadedAsset({
              secureUrl: payload.data.publicUrl,
              publicId: payload.data.publicId,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching existing knowledge PDF:", err);
      }
    };

    fetchCurrentPdf();
  }, []);

  const handleDelete = async () => {
    if (!uploadedAsset) return;
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    setIsDeleting(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/uploads/knowledge-pdf`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ public_id: uploadedAsset.publicId }),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to delete the PDF."),
        );
      }

      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.message || "Failed to delete the PDF.");
      }

      setUploadedAsset(null);
      setSelectedFile(null);
      setStatusMessage("Knowledge PDF deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete the PDF.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const selectFile = (file: File | null) => {
    setErrorMessage("");
    setStatusMessage("");
    setUploadedAsset(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!isPdfFile(file)) {
      setSelectedFile(null);
      setErrorMessage("Only PDF files are allowed.");
      return;
    }

    setSelectedFile(file);
    setStatusMessage(`Selected ${file.name}`);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Select a PDF before uploading.");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setUploadedAsset(null);
    setStatusMessage("Requesting a secure upload signature...");

    try {
      const signatureResponse = await fetch(`${apiUrl}/api/uploads/signature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!signatureResponse.ok) {
        throw new Error(
          await getErrorMessage(
            signatureResponse,
            "Failed to request the upload signature.",
          ),
        );
      }

      const signaturePayload =
        (await signatureResponse.json()) as SignatureResponse;
      const signatureData = signaturePayload.data;
      if (
        !signaturePayload.success ||
        !signatureData?.timestamp ||
        !signatureData.signature ||
        !signatureData.cloudName ||
        !signatureData.apiKey
      ) {
        throw new Error("The backend returned an incomplete upload signature.");
      }

      setStatusMessage("Uploading PDF to Cloudinary...");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("signature", signatureData.signature);

      if (signatureData.folder) {
        formData.append("folder", signatureData.folder);
      }

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/raw/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error(
          await getErrorMessage(uploadResponse, "Cloudinary upload failed."),
        );
      }

      const uploadPayload =
        (await uploadResponse.json()) as CloudinaryUploadResponse;

      setStatusMessage("Saving PDF metadata to your backend...");

      const saveResponse = await fetch(`${apiUrl}/api/uploads/knowledge-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          secure_url: uploadPayload.secure_url,
          public_url: uploadPayload.secure_url,
          public_id: uploadPayload.public_id,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error(
          await getErrorMessage(
            saveResponse,
            "Failed to save the uploaded PDF metadata.",
          ),
        );
      }

      const savePayload = (await saveResponse.json()) as BackendUploadResponse;
      if (!savePayload.success) {
        throw new Error(
          savePayload.message || "Failed to save the uploaded PDF metadata.",
        );
      }

      setUploadedAsset({
        secureUrl: uploadPayload.secure_url,
        originalFilename: uploadPayload.original_filename ?? selectedFile.name,
        bytes: uploadPayload.bytes,
        publicId: uploadPayload.public_id,
      });
      setStatusMessage("PDF uploaded and saved to the backend successfully.");
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload the PDF.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-slate-600/90">
        This section securely ingests documentation. Your chosen PDF file will
        later connect to your chatbot background vector database through a RAG
        pipeline.
      </p>

      <form
        className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start"
        onSubmit={handleUpload}
      >
        <label
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`block cursor-pointer rounded-[2rem] border-2 border-dashed p-8 text-center transition ${dashedBorder} ${isDragging ? "border-slate-400 bg-slate-50/80" : ""
            }`}
        >
          <input
            id={inputId}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            {isUploading ? (
              <LoaderCircle className="animate-spin" size={24} />
            ) : (
              <UploadCloud size={24} />
            )}
          </div>

          <span className="mt-4 block text-sm font-semibold text-slate-800">
            Drag and drop your file here, or{" "}
            <span className="text-sky-600 underline">browse</span>
          </span>
          <span className="mt-1 block text-xs text-slate-400">
            Supports PDF files up to 25MB
          </span>

          {selectedFile && (
            <div className="mx-auto mt-5 flex max-w-lg items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedFile(null);
                  setUploadedAsset(null);
                  setStatusMessage("");
                  setErrorMessage("");
                }}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          )}
        </label>

        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          className={`inline-flex h-14 items-center justify-center rounded-2xl px-8 text-sm font-semibold text-white shadow-md transition active:scale-[0.99] ${!selectedFile || isUploading
            ? "cursor-not-allowed bg-slate-300 shadow-none"
            : "bg-slate-950 hover:bg-slate-800 hover:shadow-lg"
            }`}
        >
          {isUploading ? "Uploading..." : "Upload & Sync Base"}
        </button>
      </form>

      {statusMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-emerald-600"
          />
          <p>{statusMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {uploadedAsset && (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Uploaded Asset
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">File:</span>{" "}
              {uploadedAsset.originalFilename || "Knowledge Base PDF"}
            </p>
            {uploadedAsset.bytes !== undefined && (
              <p>
                <span className="font-semibold text-slate-900">Size:</span>{" "}
                {formatBytes(uploadedAsset.bytes)}
              </p>
            )}
            <p>
              <span className="font-semibold text-slate-900">Public ID:</span>{" "}
              {uploadedAsset.publicId}
            </p>
            <div className="mt-3 flex gap-4">
              <a
                href={uploadedAsset.secureUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4"
              >
                Open uploaded PDF
              </a>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 font-semibold text-rose-600 hover:text-rose-800 disabled:text-slate-400"
              >
                {isDeleting ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePdfManager;
