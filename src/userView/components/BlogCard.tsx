import { Sparkles } from "lucide-react";
import { useState } from "react";
type BlogCardProp = {
  blog: {
    id: number;
    title: string;
    date: string;
    readTime: string;
    excerpt: string;
    image: string;
  };
  onDetail: () => void;
};
export const BlogCard = ({ blog, onDetail }: BlogCardProp) => {
  const [showAi, setShowAi] = useState<boolean>(false);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={blog.image}
          className="w-full h-full object-cover"
          alt={blog.title}
        />
        {showAi && (
          <div className="absolute inset-0 bg-purple-900/80 backdrop-blur-sm p-4 text-white flex flex-col justify-center animate-in fade-in">
            <p className="text-sm italic">
              "Quick AI overview: {blog.excerpt.slice(0, 60)}..."
            </p>
            <button
              onClick={() => setShowAi(false)}
              className="mt-2 text-xs font-bold underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
      <div className="p-5">
        <h4 className="font-bold text-lg leading-tight mb-3 group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h4>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onDetail}
            className="text-sm font-bold text-slate-800 hover:underline"
          >
            Read Detail
          </button>
          <button
            onClick={() => setShowAi(!showAi)}
            className="p-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
            <Sparkles size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
