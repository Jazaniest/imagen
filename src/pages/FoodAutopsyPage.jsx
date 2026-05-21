import { useState } from "react";
import FeatureLayout from "../components/FeatureLayout";
import ImageUploader from "../components/ImageUploader";
import GenerateResult from "../components/GenerateResult";
import { generateImage } from "../utils/api";

export default function FoodAutopsyPage() {
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
      setError("Please upload a photo of food first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const contextText = context.trim();

      const prompt = `Analyze this photo of food and create a detailed scientific anatomy / cross-section diagram illustration of it.

Style: Vintage scientific illustration meets modern infographic. Think: museum natural history poster, medical textbook cross-section, biology specimen plate.
${contextText ? `Additional context about the food: ${contextText}` : ""}

Requirements:
- Show the food cut in half or cross-sectioned to reveal its interior layers
- Label each component with scientific/anatomical-style annotations and callout lines
- Use a clean white or off-white background like a scientific illustration plate
- Include a title like "Specimen No. XX — [Food Name]" at the top
- Add fake Latin scientific classification name at bottom
- Draw individual ingredients with magnified detail circles
- Include fictional "nutritional specimen data" panel on the side
- Color palette: muted scientific illustration colors — cream, sepia, botanical illustration style
- Add plate number, scale bar, and specimen catalog details
- Make it look like it belongs in a 19th century naturalist's field guide
- Detailed, high quality scientific illustration style`;

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
      icon="🔬"
      title="Food Autopsy"
      subtitle="Upload any dish and get a stunning scientific cross-section diagram like a museum specimen plate."
      accentColor="#3DBA78"
    >
      <div className="flex flex-col gap-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          preview={imagePreview}
          label="Upload Food Photo"
        />

        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-white/50 tracking-widest uppercase">
            Additional Context{" "}
            <span className="text-white/25 normal-case font-body">(optional)</span>
          </label>
          <textarea
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm p-4 resize-none focus:outline-none focus:border-[#3DBA78]/50 transition-colors placeholder:text-white/25"
            rows={2}
            placeholder="e.g. Spicy beef rendang with coconut milk, layered flavors, Indonesian dish..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !imageFile}
          className="w-full py-4 rounded-xl font-display text-sm tracking-widest uppercase transition-all duration-200
            bg-[#3DBA78] hover:bg-[#50CC8A] text-black font-bold
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? "Dissecting..." : "Perform Food Autopsy"}
        </button>

        <GenerateResult
          imageUrl={result}
          isLoading={loading}
          error={error}
          featureName="food-autopsy"
        />
      </div>
    </FeatureLayout>
  );
}