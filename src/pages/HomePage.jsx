const FEATURES = [
  {
    id: "wanted",
    icon: "🤠",
    title: "Wanted Poster",
    description: "Turn any photo into a Wild West wanted poster with AI-generated crimes and rewards.",
    accent: "#D4A843",
    tag: "WILD WEST",
  },
  {
    id: "pethuman",
    icon: "🐾",
    title: "Pet → Human",
    description: "Reimagine your pet as a human with a job, personality, and style that matches their vibe.",
    accent: "#7C6FCD",
    tag: "SURREAL",
  },
  {
    id: "foodautopsy",
    icon: "🔬",
    title: "Food Autopsy",
    description: "Dissect any dish into a stunning scientific cross-section diagram like a biology specimen.",
    accent: "#3DBA78",
    tag: "SCIENTIFIC",
  },
  {
    id: "albumcover",
    icon: "🎵",
    title: "Album Cover",
    description: "Transform any random photo into a cinematic album cover for a fictional band and genre.",
    accent: "#E05A7A",
    tag: "MUSIC",
  },
  {
    id: "diorama",
    icon: "🏠",
    title: "Cursed Diorama",
    description: "Miniaturize any room into a tiny, surreal toy-like diorama sitting on a table.",
    accent: "#4BB8E0",
    tag: "MINIATURE",
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="font-display text-(--accent) text-xs tracking-[0.4em] uppercase mb-4">
            AI Image Agents
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight mb-6 leading-none">
            Upload.
            <br />
            <span className="text-white/30">Transform.</span>
            <br />
            Download.
          </h1>
          <p className="text-white/40 text-base max-w-md mx-auto leading-relaxed">
            Five wildly different AI agents. One image in, one image out.
            No prompt engineering needed.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <button
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              className="group text-left rounded-2xl border border-white/10 bg-white/3 p-6 hover:bg-white/6 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${feature.accent}22`, border: `1px solid ${feature.accent}44` }}
                >
                  {feature.icon}
                </div>
                <span
                  className="text-[10px] font-display tracking-widest px-2 py-1 rounded-md"
                  style={{ color: feature.accent, background: `${feature.accent}15` }}
                >
                  {feature.tag}
                </span>
              </div>
              <h2 className="font-display text-white text-lg tracking-wide mb-2">{feature.title}</h2>
              <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
              <div
                className="mt-5 flex items-center gap-2 text-xs font-display tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: feature.accent }}
              >
                <span>Try it</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-xs mt-12 font-display tracking-wider uppercase">
          Powered by bytedance-seed/seedream-4.5 via lunos.tech
        </p>
      </div>
    </div>
  );
}