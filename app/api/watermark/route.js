import { NextResponse } from "next/server";
import sharp from "sharp";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");
  const watermarkText = searchParams.get("watermarkText");

  try {
    // Fetch the image from the provided URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    // Get the image dimensions
    const imageMetadata = await sharp(imageBuffer).metadata();
    const { width, height } = imageMetadata;

    // Resize the image to 1x1 pixel to extract the average color
    const { dominantColor } = await sharp(imageBuffer)
      .resize(1, 1)
      .toBuffer()
      .then((buffer) => {
        const [r, g, b] = buffer;
        return { dominantColor: { r, g, b } };
      });

    // Function to calculate the complementary color
    const getComplementaryColor = ({ r, g, b }) => {
      return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b,
      };
    };

    // Function to calculate an analogous color (slight shift)
    const getAnalogousColor = ({ r, g, b }) => {
      return {
        r: (r + 30) % 255,
        g: (g + 30) % 255,
        b: (b + 30) % 255,
      };
    };

    // Calculate colors
    const complementaryColor = getComplementaryColor(dominantColor);
    const analogousColor = getAnalogousColor(dominantColor);

    const complementaryColorStr = `rgb(${complementaryColor.r}, ${complementaryColor.g}, ${complementaryColor.b})`;
    const analogousColorStr = `rgb(${analogousColor.r}, ${analogousColor.g}, ${analogousColor.b})`;

    // Create a watermark using SVG with both colors
    const svgWatermark = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="watermarkPattern1" patternUnits="userSpaceOnUse" width="250" height="250">
            <text x="125" y="125" font-size="30" fill="${complementaryColorStr}" text-anchor="middle"
            style="dominant-baseline: middle; font-family: Arial, sans-serif;" transform="rotate(-30, 125, 125)"
            opacity="0.5">${watermarkText}</text>
          </pattern>
          <pattern id="watermarkPattern2" patternUnits="userSpaceOnUse" width="250" height="250">
            <text x="125" y="150" font-size="30" fill="${analogousColorStr}" text-anchor="middle"
            style="dominant-baseline: middle; font-family: Arial, sans-serif;" transform="rotate(-30, 125, 150)"
            opacity="0.5">${watermarkText}</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#watermarkPattern1)" />
        <rect width="100%" height="100%" fill="url(#watermarkPattern2)" />
        <text x="${width / 2}" y="${height - 20}" font-size="24" fill="${complementaryColorStr}" text-anchor="middle"
        style="dominant-baseline: middle; font-family: Arial, sans-serif;" opacity="0.8">${watermarkText}</text>
        <text x="${width / 2}" y="${height - 5}" font-size="24" fill="${analogousColorStr}" text-anchor="middle"
        style="dominant-baseline: middle; font-family: Arial, sans-serif;" opacity="0.8">${watermarkText}</text>
      </svg>
    `;

    // Ensure the SVG dimensions match the base image
    const resizedSvg = await sharp(Buffer.from(svgWatermark))
      .resize(width, height)
      .toBuffer();

    // Apply the watermark using sharp
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: resizedSvg,
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
    console.error("Error processing image:", error.message);
    return new NextResponse("Error processing image", { status: 500 });
  }
}
