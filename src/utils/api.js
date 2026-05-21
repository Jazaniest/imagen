const API_BASE = "https://api.lunos.tech/v1/chat/completions";

// Available image generation models on lunos.tech (from GET /v1/models?output=image)
// seedream-4.5              → outputModalities: ["image"] ONLY → modalities: ["image"]
// gemini-2.5-flash-image    → outputModalities: ["image","text"] → modalities: ["image","text"]
// gemini-3-pro-image-preview → outputModalities: ["image","text"] → modalities: ["image","text"]
export const MODELS = {
  seedream: {
    id: "bytedance-seed/seedream-4.5",
    label: "Seedream 4.5 (ByteDance)",
    modalities: ["image"], // image-only — MUST NOT include "text"
  },
  geminiFlash: {
    id: "google/gemini-2.5-flash-image",
    label: "Gemini 2.5 Flash Image",
    modalities: ["image", "text"],
  },
  geminiPro: {
    id: "google/gemini-3-pro-image-preview",
    label: "Gemini 3 Pro Image Preview",
    modalities: ["image", "text"],
  },
};

// Default model used across all features
const DEFAULT_MODEL = MODELS.seedream;

/**
 * Convert a File to base64 data URL
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate an image via lunos.tech
 * @param {object} opts
 * @param {string} opts.prompt        - Text prompt
 * @param {File|null} opts.imageFile  - Optional input image (sent as base64)
 * @param {string} opts.aspectRatio   - e.g. "1:1", "2:3", "4:3"
 * @param {object} opts.model         - One of MODELS.*  (defaults to seedream)
 * @returns {Promise<string>}         - URL or data URL of generated image
 */
export async function generateImage({
  prompt,
  imageFile = null,
  aspectRatio = "1:1",
  model = DEFAULT_MODEL,
}) {
  const apiKey = import.meta.env.VITE_LUNOS_API_KEY;
  if (!apiKey) throw new Error("VITE_LUNOS_API_KEY is not set in .env");

  // Build content array: text first, then image (per lunos docs)
  const content = [{ type: "text", text: prompt }];

  if (imageFile) {
    const dataUrl = await fileToBase64(imageFile);
    const mimeType = imageFile.type || "image/jpeg";
    const fullDataUrl = dataUrl.startsWith("data:")
      ? dataUrl
      : `data:${mimeType};base64,${dataUrl.split(",")[1]}`;

    content.push({
      type: "image_url",
      image_url: { url: fullDataUrl },
    });
  }

  const body = {
    model: model.id,
    messages: [
      {
        role: "user",
        // Plain string when no image; array when image is included
        content: imageFile ? content : prompt,
      },
    ],
    // CRITICAL: seedream-4.5 only supports ["image"] — NOT ["image","text"]
    modalities: model.modalities,
    image_config: {
      aspect_ratio: aspectRatio,
      image_size: "1K", // valid values: "1K" | "2K" | "4K"
    },
  };

  console.debug("[lunos] request →", model.id, "modalities:", model.modalities);

  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("[lunos] error response:", err);
    throw new Error(
      err?.error?.message || `API Error ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();
  console.debug("[lunos] full response:", data);

  const message = data?.choices?.[0]?.message;
  if (!message) throw new Error("Empty response from API");

  // ✅ PRIMARY path — per lunos docs: images are in message.images[]
  if (Array.isArray(message.images) && message.images.length > 0) {
    const img = message.images[0];
    if (img?.image_url?.url) return img.image_url.url;
    if (img?.url) return img.url;
  }

  // Fallback: images inside content[] array
  if (Array.isArray(message.content)) {
    for (const block of message.content) {
      if (
        (block.type === "image_url" || block.type === "image") &&
        block.image_url?.url
      ) {
        return block.image_url.url;
      }
    }
  }

  // Fallback: DALL-E / OpenAI style
  if (data?.data?.[0]?.b64_json)
    return `data:image/png;base64,${data.data[0].b64_json}`;
  if (data?.data?.[0]?.url) return data.data[0].url;

  // Fallback: content is a URL string
  if (
    typeof message.content === "string" &&
    (message.content.startsWith("http") || message.content.startsWith("data:"))
  ) {
    return message.content;
  }

  console.error("[lunos] unexpected response shape:", JSON.stringify(data));
  throw new Error(
    "No image found in API response. Open DevTools → Console and look for [lunos] full response."
  );
}