"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [watermarkedImage, setWatermarkedImage] = useState("");

  useEffect(() => {
    const fetchWatermarkedImage = async () => {
      const res = await fetch(
        "/api/watermark?imageUrl=/images/some-any.jpg&watermarkText=SampleWatermark"
      );
      const blob = await res.blob();
      setWatermarkedImage(URL.createObjectURL(blob));
    };

    fetchWatermarkedImage();
  }, []);

  return (
    <div>
      <h1>Watermarked Image</h1>
      {watermarkedImage && (
        <Image src={watermarkedImage} alt="Watermarked" width={400} height={400} />
      )}
    </div>
  );
}
