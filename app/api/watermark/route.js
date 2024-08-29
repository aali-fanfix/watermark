import { NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function GET(request) {
  // Parse the query parameters
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");
  const watermarkText = searchParams.get("watermarkText");

  // Resolve the image path
  const imagePath = path.join(process.cwd(), "public", imageUrl);

  try {
    // Load the image using sharp
    const image = fs.readFileSync(imagePath);

    // Apply watermark using sharp
    const watermarkedImage = await sharp(image)
      .composite([
        {
          input: Buffer.from(
            `<svg><text x="10" y="50" font-size="48" fill="white">${watermarkText}</text></svg>`
          ),
          gravity: "southeast",
        },
      ])
      .toBuffer();

    return new NextResponse(watermarkedImage, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new NextResponse("Error processing image", { status: 500 });
  }
}
