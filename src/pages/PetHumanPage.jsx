import { useState } from "react";
import FeatureLayout from "../components/FeatureLayout";
import ImageUploader from "../components/ImageUploader";
import GenerateResult from "../components/GenerateResult";
import { generateImage } from "../utils/api";

const PERSONALITY_OPTIONS = [
  "Lazy and sarcastic office worker",
  "Energetic personal trainer",
  "Grumpy old professor",
  "Friendly barista",
  "Mysterious night owl artist",
  "Corporate CEO",
];

export default function PetHumanPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [context, setContext] = useState("");
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
      setError("Please upload a photo of your pet first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const contextText = context.trim() || "Friendly and playful, loves napping and attention";

      const prompt = `Look at this photo of a pet animal. Now reimagine and generate an illustration of this animal's human equivalent — a human character that captures the exact same personality, vibe, and energy as this pet.

Personality / context about this pet: ${contextText}

Requirements:
- Create a detailed character portrait illustration of the human version
- The human should have clothing, hairstyle, accessories, and expression that perfectly match the pet's personality
- Include subtle visual references to the animal (color palette, patterns, posture)
- Style: cinematic character concept art, detailed illustration
- Show the character in a setting or pose that fits their personality
- Make it feel like official character art for a movie or game
- Portrait or half-body composition
- High quality, detailed, expressive`;

      const url = await generateImage({
        prompt,
        imageFile,
        aspectRatio: "3:4",
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
      icon="🐾"
      title="If Your Pet Was Human"
      subtitle="Upload a photo of your pet and discover what they'd look like as a human character."
      accentColor="#7C6FCD"
    >
      <div className="flex flex-col gap-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          preview={imagePreview}
          label="Upload Pet Photo"
        />

        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-white/50 tracking-widest uppercase">
            Personality / Vibe{" "}
            <span className="text-white/25 normal-case font-body">(optional)</span>
          </label>
          <textarea
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm p-4 resize-none focus:outline-none focus:border-[#7C6FCD]/50 transition-colors placeholder:text-white/25"
            rows={2}
            placeholder="e.g. Lazy and sarcastic, loves sleeping, judges everyone silently..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          {/* Quick personality chips */}
          <div className="flex flex-wrap gap-2 mt-1">
            {PERSONALITY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setContext(opt)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-display tracking-wide
                  ${context === opt
                    ? "bg-[#7C6FCD]/20 border-[#7C6FCD]/60 text-[#A89FE0]"
                    : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !imageFile}
          className="w-full py-4 rounded-xl font-display text-sm tracking-widest uppercase transition-all duration-200
            bg-[#7C6FCD] hover:bg-[#9085D9] text-white font-bold
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? "Generating..." : "Humanize My Pet"}
        </button>

        <GenerateResult
          imageUrl={result}
          isLoading={loading}
          error={error}
          featureName="pet-human"
        />
      </div>
    </FeatureLayout>
  );
}