"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  // Accept imageUrl as a prop
  const [watermarkedImage, setWatermarkedImage] = useState("");
  const imageUrl =
    "https://storage.googleapis.com/fanfix2/PostMedia/vMYTWgZ1oRaVymOq82hOLCsIYf5c/7da0f6c2-859d-4f92-9d6d-207d08d77a29_original.webp";

  useEffect(() => {
    const fetchWatermarkedImage = async () => {
      const res = await fetch(
        `/api/watermark?imageUrl=${encodeURIComponent(
          imageUrl
        )}&watermarkText=SampleWatermark`
      );
      const blob = await res.blob();
      setWatermarkedImage(URL.createObjectURL(blob));
    };

    fetchWatermarkedImage();
  }, [imageUrl]); // Add imageUrl as a dependency

  return (
    <div>
      <h1>Watermarked Image</h1>
      {watermarkedImage && (
        <Image
          src={watermarkedImage}
          alt="Watermarked"
          width={400}
          height={400}
        />
      )}
    </div>
  );
}
