import { useState } from "react";

const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "wanted", label: "Wanted Poster", icon: "🤠" },
    { id: "pethuman", label: "Pet → Human", icon: "🐾" },
    { id: "foodautopsy", label: "Food Autopsy", icon: "🔬" },
    { id: "albumcover", label: "Album Cover", icon: "🎵" },
    { id: "diorama", label: "Cursed Diorama", icon: "🏠" },
];

export default function Navbar({ currentPage, onNavigate }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
            >
            <div className="w-8 h-8 rounded-lg bg-(--accent) flex items-center justify-center">
                <span className="text-black text-xs font-bold font-display">AI</span>
            </div>
            <span className="font-display text-white tracking-wider text-sm uppercase hidden sm:block">
                Image Agent
            </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.filter((i) => i.id !== "home").map((item) => (
                <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-xs font-display tracking-wider uppercase transition-all duration-200 flex items-center gap-2
                    ${currentPage === item.id
                    ? "bg-(--accent) text-black font-bold"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                    }`}
                >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                </button>
            ))}
            </div>

            {/* Mobile Hamburger */}
            <button
            className="lg:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </>
                ) : (
                <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </>
                )}
            </svg>
            </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
            <div className="lg:hidden border-t border-white/10 bg-[#0d0d0d] px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
                <button
                key={item.id}
                onClick={() => {
                    onNavigate(item.id);
                    setMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-display tracking-wider uppercase transition-all flex items-center gap-3
                    ${currentPage === item.id
                    ? "bg-(--accent) text-black font-bold"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                    }`}
                >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                </button>
            ))}
            </div>
        )}
        </nav>
    );
}