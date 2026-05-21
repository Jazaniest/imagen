export default function FeatureLayout({ icon, title, subtitle, accentColor, children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div
            className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-3xl mb-4"
            style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}
          >
            {icon}
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}