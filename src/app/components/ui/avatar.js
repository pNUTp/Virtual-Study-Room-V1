"use client";
import Image from "next/image";

export function Avatar({ src, alt = "User", className, size = 40 }) {
  return (
    <Image
      src={src || "/default-avatar.png"}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
}
