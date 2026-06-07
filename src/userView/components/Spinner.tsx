interface SpinnerProps {
  color?: "sky" | "indigo" | "purple" | "blue" | "emerald";
  text?: string;
}

export const Spinner = ({ color = "sky", text }: SpinnerProps) => {
  const colorMap = {
    sky: "border-sky-500/20 border-t-sky-500 text-sky-500",
    indigo: "border-indigo-500/20 border-t-indigo-500 text-indigo-500",
    purple: "border-purple-500/20 border-t-purple-500 text-purple-500",
    blue: "border-blue-500/20 border-t-blue-500 text-blue-500",
    emerald: "border-emerald-500/20 border-t-emerald-500 text-emerald-500",
  };

  const bgMap = {
    sky: "bg-sky-500/10",
    indigo: "bg-indigo-500/10",
    purple: "bg-purple-500/10",
    blue: "bg-blue-500/10",
    emerald: "bg-emerald-500/10",
  };

  return (
    <div className="flex w-full flex-col items-center justify-center py-20">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className={`h-12 w-12 animate-spin rounded-full border-4 ${colorMap[color]}`}></div>
        {/* Inner pulsing glow */}
        <div className={`absolute h-8 w-8 animate-ping rounded-full ${bgMap[color]}`}></div>
      </div>
      {text && (
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
