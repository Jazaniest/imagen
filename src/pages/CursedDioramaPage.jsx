import { useState } from "react";
import FeatureLayout from "../components/FeatureLayout";
import ImageUploader from "../components/ImageUploader";
import GenerateResult from "../components/GenerateResult";
import { generateImage } from "../utils/api";

const STYLES = [
  "Dollhouse miniature",
  "Japanese diorama",
  "Wes Anderson",
  "Dark gothic",
  "Cozy cottagecore",
  "Sci-fi model kit",
];

export default function CursedDioramaPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [context, setContext] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setError("Please upload a photo of a room or space first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const styleText = selectedStyle || "dollhouse miniature";
      const contextText = context.trim();

      const prompt = `Take this photo of a room or space and transform it into a tiny ${styleText} diorama — as if the entire room has been shrunk down and placed on a table as a miniature model.

${contextText ? `Additional context: ${contextText}` : ""}

Requirements:
- The room should appear as a tiny 3D miniature model/diorama sitting on a flat surface
- Show the miniature from a slight elevated angle so you can see it's a tiny model
- Apply tilt-shift photography effect to make it look miniature
- The ${styleText} aesthetic should define the color palette, lighting, and mood
- Add tiny imperfections like miniature props, texture of model materials (cardboard, foam, paint)
- The surrounding area shows it's sitting on a table or display surface
- Lighting should be warm and dramatic like a photo of an actual scale model
- Make it look like an incredibly detailed artisan-crafted miniature diorama
- Photorealistic miniature photography style
- You can see the edges and base of the diorama box/frame
- Scale: looks like approximately 1:12 scale model`;

      const url = await generateImage({
        prompt,
        imageFile,
        aspectRatio: "4:3",
      });

      setResult(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureLayout
      icon="🏠"
      title="Cursed Diorama"
      subtitle="Upload any room and watch it shrink into a tiny, surreal miniature diorama sitting on a table."
      accentColor="#4BB8E0"
    >
      <div className="flex flex-col gap-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          preview={imagePreview}
          label="Upload Room / Space Photo"
        />

        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-white/50 tracking-widest uppercase">
            Diorama Style
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStyle(selectedStyle === s ? "" : s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-display tracking-wide
                  ${selectedStyle === s
                    ? "bg-[#4BB8E0]/20 border-[#4BB8E0]/60 text-[#7ACCE8]"
                    : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-white/50 tracking-widest uppercase">
            Extra Details{" "}
            <span className="text-white/25 normal-case font-body">(optional)</span>
          </label>
          <textarea
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm p-4 resize-none focus:outline-none focus:border-[#4BB8E0]/50 transition-colors placeholder:text-white/25"
            rows={2}
            placeholder="e.g. Add tiny people, make it look abandoned, autumn leaves falling..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !imageFile}
          className="w-full py-4 rounded-xl font-display text-sm tracking-widest uppercase transition-all duration-200
            bg-[#4BB8E0] hover:bg-[#65C8EC] text-black font-bold
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? "Miniaturizing..." : "Shrink Into Diorama"}
        </button>

        <GenerateResult
          imageUrl={result}
          isLoading={loading}
          error={error}
          featureName="cursed-diorama"
        />
      </div>
    </FeatureLayout>
  );
}