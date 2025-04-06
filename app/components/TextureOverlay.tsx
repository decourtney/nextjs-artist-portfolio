import React from "react";

type TextureType =
  | "noise"
  | "dots"
  | "lines"
  | "grid"
  | "soft"
  | "canvas"
  | "papyrus"
  | "paper"
  | "marble";

interface TextureOverlayProps {
  type?: TextureType;
  className?: string;
  opacity?: number;
}

export default function TextureOverlay({
  type = "canvas",
  className = "",
  opacity = 0.6,
}: TextureOverlayProps) {
  const getTextureStyle = () => {
    switch (type) {
      case "papyrus":
        return {
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter3)'/%3E%3C/svg%3E")
          `,
          backgroundSize: `
            100px 100px,
            200px 200px,
            400px 400px
          `,
          backgroundPosition: `
            0 0,
            0 0,
            0 0
          `,
          backgroundRepeat: "repeat",
          backgroundColor: "rgba(255, 255, 255, 0.01)",
        };
      case "paper":
        return {
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter3)'/%3E%3C/svg%3E")
          `,
          backgroundSize: `
            100px 100px,
            200px 200px,
            400px 400px
          `,
          backgroundPosition: `
            0 0,
            0 0,
            0 0
          `,
          backgroundRepeat: "repeat",
          backgroundColor: "rgba(255, 255, 255, 0.01)",
        };
      case "marble":
        return {
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E"),
            linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.03) 75%),
            linear-gradient(-45deg, rgba(0,0,0,0.03) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.03) 75%),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: `
            400px 400px,
            800px 800px,
            200px 200px,
            200px 200px,
            100px 100px,
            100px 100px
          `,
          backgroundPosition: `
            0 0,
            0 0,
            0 0,
            100px 100px,
            0 0,
            0 0
          `,
          backgroundRepeat: "repeat",
          backgroundColor: "rgba(255, 255, 255, 0.01)",
        };
      case "canvas":
        return {
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px),
            linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%),
            linear-gradient(-45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%)
          `,
          backgroundSize: `
            8px 8px,
            8px 8px,
            16px 16px,
            16px 16px
          `,
          backgroundPosition: `
            0 0,
            0 0,
            0 0,
            8px 8px
          `,
          backgroundRepeat: "repeat",
        };
      case "dots":
        return {
          backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.5) 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0",
          backgroundRepeat: "repeat",
        };
      case "grid":
        return {
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0",
          backgroundRepeat: "repeat",
        };
      case "lines":
        return {
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0",
          backgroundRepeat: "repeat",
        };
      case "noise":
      case "soft":
      default:
        return {
          backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.5) 0.5px, transparent 0.5px)`,
          backgroundSize: "5px 5px",
          backgroundPosition: "0 0",
          backgroundRepeat: "repeat",
        };
    }
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        ...getTextureStyle(),
        opacity,
        zIndex: 20,
        mixBlendMode: "multiply",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
