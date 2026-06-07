import { ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Spinner } from "./components/Spinner";

export const Certificates = () => {
  const [certAI, setCertAI] = useState(false);
  const { certificates: certs, isContextLoading } = usePortfolio();

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Certifications</h2>
          <button
            onClick={() => setCertAI(!certAI)}
            className="p-2 bg-white text-purple-600 border border-purple-100 rounded-lg shadow-sm hover:bg-purple-50 transition"
          >
            <Sparkles size={20} />
          </button>
        </div>

        {certAI && (
          <div className="mb-8 p-4 bg-purple-50 rounded-xl text-purple-900 italic text-sm border border-purple-100">
            "AI Note: Ashar's certifications confirm a dual-specialization in
            high-performance backend logic and standardized frontend practices."
          </div>
        )}

        {isContextLoading ? (
          <Spinner color="purple" text="Loading certifications..." />
        ) : certs.length === 0 ? (
          <div className="flex h-full items-center justify-center py-20 text-slate-500">
            No certifications to display yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {certs.map(
              (
                cert: {
                  image: string;
                  link: string;
                  title: string;
                  issuer: string;
                },
                i: number,
              ) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all hover:-translate-y-1"
                >
                  <img
                    src={cert.image}
                    className="w-full h-40 object-cover"
                    alt=""
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 mb-1">
                      {cert.title}
                    </h4>
                    <p className="text-slate-500 text-sm mb-4">{cert.issuer}</p>
                    <a
                      href={cert.link}
                      className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline"
                    >
                      Verify Credentials <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};
