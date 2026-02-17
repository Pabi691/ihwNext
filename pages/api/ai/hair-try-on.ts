import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb",
    },
  },
};

type HairTryOnRequestBody = {
  faceImageBase64?: string;
  faceImageMimeType?: string;
  productImageUrl?: string;
};

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

function isVertexEnabled() {
  const useVertex = process.env.GOOGLE_GENAI_USE_VERTEXAI === "true";
  const hasVertexProject = Boolean(process.env.GOOGLE_CLOUD_PROJECT);
  const hasVertexLocation = Boolean(process.env.GOOGLE_CLOUD_LOCATION);
  return useVertex && hasVertexProject && hasVertexLocation;
}

async function fetchImageAsBase64(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch product image.");
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();

  return {
    mimeType: contentType,
    imageBytes: toBase64(arrayBuffer),
  };
}

function extractInlineImage(response: any) {
  const candidates = response?.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts || [];
    for (const part of parts) {
      const data = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || "image/png";
      if (data && String(mimeType).startsWith("image/")) {
        return { data, mimeType };
      }
    }
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body = (req.body || {}) as HairTryOnRequestBody;
    const faceImageBase64 = body.faceImageBase64;
    const faceImageMimeType = body.faceImageMimeType || "image/jpeg";
    const productImageUrl = body.productImageUrl;

    if (!faceImageBase64 || !productImageUrl) {
      return res.status(400).json({
        message: "faceImageBase64 and productImageUrl are required.",
      });
    }

    const productImage = await fetchImageAsBase64(productImageUrl);

    if (isVertexEnabled()) {
      const ai = new GoogleGenAI({
        vertexai: true,
        project: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION,
      });
      const model = process.env.VIRTUAL_TRY_ON_MODEL || "virtual-try-on-001";

      const response = await ai.models.recontextImage({
        model,
        source: {
          personImage: {
            imageBytes: faceImageBase64,
            mimeType: faceImageMimeType,
          },
          productImages: [
            {
              productImage: {
                imageBytes: productImage.imageBytes,
                mimeType: productImage.mimeType,
              },
            },
          ],
        },
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          outputCompressionQuality: 92,
        },
      });

      const imageBase64 = response.generatedImages?.[0]?.image?.imageBytes;
      if (!imageBase64) {
        return res.status(502).json({
          message: "Vertex AI did not return an output image.",
        });
      }

      return res.status(200).json({
        generatedImageDataUrl: `data:image/jpeg;base64,${imageBase64}`,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        message:
          "Set Vertex env vars (GOOGLE_CLOUD_PROJECT + GOOGLE_CLOUD_LOCATION) or add GEMINI_API_KEY/GOOGLE_API_KEY.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const imageModel = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview";

    const response = await ai.models.generateContent({
      model: imageModel,
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Edit the first image (person photo) by applying a realistic hair patch based on the second image (product reference). Keep the same face identity and preserve photorealistic quality for ecommerce preview.",
            },
            {
              inlineData: {
                data: faceImageBase64,
                mimeType: faceImageMimeType,
              },
            },
            {
              inlineData: {
                data: productImage.imageBytes,
                mimeType: productImage.mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const generated = extractInlineImage(response);
    if (!generated) {
      return res.status(502).json({
        message:
          "Gemini image model did not return an image. Try another photo or configure Vertex AI for virtual-try-on model.",
      });
    }

    return res.status(200).json({
      generatedImageDataUrl: `data:${generated.mimeType};base64,${generated.data}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown AI generation error";
    return res.status(500).json({ message });
  }
}
