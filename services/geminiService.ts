import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

const getMimeType = (file: File): string => {
    if (file.type && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
        return file.type;
    }
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'webp':
            return 'image/webp';
        default:
            // Default to JPEG if type is unknown or unsupported, as it's widely accepted.
            return 'image/jpeg';
    }
};

export const placeProductInScene = async (imageFile: File): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const b64Data = await fileToBase64(imageFile);
  const mimeType = getMimeType(imageFile);

  const prompt = `Create a professional studio-style image of the uploaded product. Keep the product exactly as it is — no changes to text, colors, or design details. Place it in a dark brown gradient background with soft lighting transitions. Use professional studio lighting that highlights the product’s texture and materials, with realistic soft shadows, depth, and a three-dimensional look. The result should appear clean, elegant, and luxurious — like a premium product photo captured in a high-end studio.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: b64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error('Image processing failed: No image data returned.');
};
