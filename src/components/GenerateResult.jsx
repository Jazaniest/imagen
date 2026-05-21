import { useRef } from "react";

export default function GenerateResult({ imageUrl, isLoading, error, featureName }) {
    //eslint-disable-next-line
    const downloadRef = useRef(null);

    const handleDownload = () => {
        if (!imageUrl) return;

        // If it's a data URL, download directly
        if (imageUrl.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = `${featureName || "result"}-${Date.now()}.png`;
        a.click();
        return;
        }

        // If it's a regular URL, fetch and download
        fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${featureName || "result"}-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        })
        .catch(() => {
            // Fallback: open in new tab
            window.open(imageUrl, "_blank");
        });
    };

    if (isLoading) {
        return (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
            <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-(--accent)/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-(--accent) animate-spin" />
            <div className="absolute inset-3 rounded-full border-t-2 border-(--accent)/50 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
            </div>
            <div className="text-center">
            <p className="font-display text-white/60 text-sm tracking-widest uppercase animate-pulse">
                Generating...
            </p>
            <p className="text-white/30 text-xs mt-1">This may take up to 30 seconds</p>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-center">
            <div className="text-red-400 text-2xl mb-2">⚠</div>
            <p className="font-display text-red-400 text-sm tracking-wide uppercase mb-1">Error</p>
            <p className="text-white/50 text-sm">{error}</p>
        </div>
        );
    }

    if (!imageUrl) return null;

    return (
        <div className="flex flex-col gap-4 animate-fadeIn">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
            <img
            src={imageUrl}
            alt="Generated result"
            className="w-full object-contain max-h-150"
            />
        </div>
        <button
            onClick={handleDownload}
            className="w-full py-4 rounded-xl font-display text-sm tracking-widest uppercase transition-all duration-200
            bg-(--accent) hover:bg-(--accent-hover) text-black font-bold
            hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
            </svg>
            Download Image
        </button>
        </div>
    );
}