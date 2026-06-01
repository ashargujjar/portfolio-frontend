import { ArrowLeft, KeyRound, UserRound, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const Login = () => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>

        <div className="mx-auto w-full max-w-xl">
          <section className="rounded-[2rem] border border-slate-800 bg-white p-8 text-slate-900 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.65)]">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                Login
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Admin sign in
              </h2>
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form
              className="mt-8 space-y-6"
              onSubmit={handleLogin}
            >
              <label className="block">
                <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <UserRound size={16} />
                  Username
                </span>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <KeyRound size={16} />
                  Login Pin
                </span>
                <input
                  type="password"
                  name="pin"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter login pin"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Access Admin"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
