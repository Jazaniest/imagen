import { useState } from "react";
import FeatureLayout from "../components/FeatureLayout";
import ImageUploader from "../components/ImageUploader";
import GenerateResult from "../components/GenerateResult";
import { generateImage } from "../utils/api";

const GENRES = [
  "Post-rock",
  "Dark Jazz",
  "Vaporwave",
  "Death Metal",
  "Indie Folk",
  "Hyperpop",
  "Ambient",
  "Trap Soul",
];

export default function AlbumCoverPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [context, setContext] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
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
      const genreText = selectedGenre || "experimental";
      const contextText = context.trim() || "melancholic, late night, emotional journey";

      const prompt = `Transform this photo into a professional music album cover artwork for a ${genreText} artist.

Mood/theme context: ${contextText}

Requirements:
- Create a striking, commercially-viable album cover composition (square 1:1 format)
- Invent a fictional artist/band name that fits the mood — place it on the cover
- Invent a fictional album title that fits the aesthetic — place it on the cover
- Typography should match the genre: ${genreText} style lettering
- Use the photo as the base but dramatically stylize it to fit album art aesthetics
- Apply appropriate color grading, filters, overlays, and treatments for ${genreText} genre
- Add subtle graphic design elements, textures, or geometric shapes typical of the genre
- The result should look like it belongs on Spotify's "This Is..." playlist
- Professional record label quality — like something you'd see in a vinyl store
- Include subtle "LP" or tracklist hints if it fits the aesthetic
- Make it iconic and memorable`;

      const url = await generateImage({
        prompt,
        imageFile,
        aspectRatio: "1:1",
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
      icon="🎵"
      title="The Album Cover"
      subtitle="Any photo becomes a cinematic album cover for a fictional artist and genre of your choice."
      accentColor="#E05A7A"
    >
      <div className="flex flex-col gap-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          preview={imagePreview}
          label="Upload Any Photo"
        />

        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-white/50 tracking-widest uppercase">
            Genre
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(selectedGenre === g ? "" : g)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-display tracking-wide
                  ${selectedGenre === g
                    ? "bg-[#E05A7A]/20 border-[#E05A7A]/60 text-[#F08098]"
                    : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-white/50 tracking-widest uppercase">
            Mood / Vibe{" "}
            <span className="text-white/25 normal-case font-body">(optional)</span>
          </label>
          <textarea
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm p-4 resize-none focus:outline-none focus:border-[#E05A7A]/50 transition-colors placeholder:text-white/25"
            rows={2}
            placeholder="e.g. Rainy night in the city, nostalgia, heartbreak, cinematic..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !imageFile}
          className="w-full py-4 rounded-xl font-display text-sm tracking-widest uppercase transition-all duration-200
            bg-[#E05A7A] hover:bg-[#EE7090] text-white font-bold
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? "Generating..." : "Create Album Cover"}
        </button>

        <GenerateResult
          imageUrl={result}
          isLoading={loading}
          error={error}
          featureName="album-cover"
        />
      </div>
    </FeatureLayout>
  );
}