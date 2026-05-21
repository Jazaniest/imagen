import { useState } from "react";
import FeatureLayout from "../components/FeatureLayout";
import ImageUploader from "../components/ImageUploader";
import GenerateResult from "../components/GenerateResult";
import { generateImage } from "../utils/api";

const DEFAULT_CONTEXT =
  "Notorious outlaw, robbed 7 banks, last seen riding a black horse. Reward: $500 DEAD OR ALIVE";

export default function WantedPosterPage() {
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
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const contextText = context.trim() || DEFAULT_CONTEXT;

      const prompt = `Transform this portrait photo into a vintage Wild West WANTED poster illustration. 
Style: aged sepia-toned paper, woodblock typography, distressed texture, old west aesthetic.
The person in the photo should be rendered as the wanted outlaw.
Context about this person: ${contextText}
Include: "WANTED" in large bold letters at top, "DEAD OR ALIVE" below, a reward amount, 
crime description, and decorative western border. 
Make it look like an authentic 1880s wanted poster, printed illustration style.
Output: Full poster composition, portrait orientation.`;

      const url = await generateImage({
        prompt,
        imageFile,
        aspectRatio: "2:3",
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
      icon="🤠"
      title="Wanted Poster"
      subtitle="Upload a photo of anyone and we'll turn them into a Wild West outlaw with their own wanted poster."
      accentColor="#D4A843"
    >
      <div className="flex flex-col gap-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          preview={imagePreview}
          label="Upload Portrait Photo"
        />

        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-white/50 tracking-widest uppercase">
            Context / Crime Description{" "}
            <span className="text-white/25 normal-case font-body">(optional)</span>
          </label>
          <textarea
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm p-4 resize-none focus:outline-none focus:border-[#D4A843]/50 transition-colors placeholder:text-white/25"
            rows={3}
            placeholder={DEFAULT_CONTEXT}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !imageFile}
          className="w-full py-4 rounded-xl font-display text-sm tracking-widest uppercase transition-all duration-200
            bg-[#D4A843] hover:bg-[#E8BC57] text-black font-bold
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? "Generating..." : "Generate Wanted Poster"}
        </button>

        <GenerateResult
          imageUrl={result}
          isLoading={loading}
          error={error}
          featureName="wanted-poster"
        />
      </div>
    </FeatureLayout>
  );
}