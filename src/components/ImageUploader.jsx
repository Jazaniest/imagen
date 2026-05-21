import { useState, useRef, useCallback } from "react";

export default function ImageUploader({ onImageSelect, preview, label = "Upload Image" }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleFile = useCallback(
        (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        onImageSelect(file);
        },
        [onImageSelect]
    );

    const handleDrop = useCallback(
        (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
        },
        [handleFile]
    );

    const handlePaste = useCallback(
        (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.startsWith("image/")) {
            handleFile(item.getAsFile());
            break;
            }
        }
        },
        [handleFile]
    );

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);

    return (
        <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
            ${isDragging ? "border-(--accent) bg-(--accent)/10 scale-[1.01]" : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/8"}
        `}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onPaste={handlePaste}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        style={{ minHeight: "220px" }}
        >
        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
        />

        {preview ? (
            <div className="relative w-full h-full" style={{ minHeight: "220px" }}>
            <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-2xl"
                style={{ minHeight: "220px", maxHeight: "360px" }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-2xl">
                <span className="text-white font-display text-sm tracking-widest uppercase">
                Change Image
                </span>
            </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                ${isDragging ? "bg-(--accent)/20" : "bg-white/10"}
                `}
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
                </svg>
            </div>
            <div>
                <p className="font-display text-white/80 text-sm tracking-wider uppercase mb-1">{label}</p>
                <p className="text-white/40 text-xs">
                Drop, paste, or click to upload
                </p>
            </div>
            </div>
        )}
        </div>
    );
}