export interface iImage {
  id: string;
  src: string;
  name?: string;
  width: number;
  height: number;
  keywords?: string[];
  alt?: string;
  category: string;
}

export const socialMediaImges: iImage[] = [
  {
    src: "/images/social-media/bluesky.svg",
    id: "bluesky",
    name: "Bluesky",
    height: 256,
    width: 256,
    keywords: ["bluesky", "social media"],
    category: "social_media",
  },
  {
    src: "/images/social-media/twitter.svg",
    id: "twitter",
    name: "Twitter",
    height: 256,
    width: 256,
    keywords: ["twitter", "x", "social media"],
    category: "social_media",
  },
  {
    src: "/images/social-media/x.svg",
    id: "x",
    name: "X",
    height: 256,
    width: 256,
    keywords: ["x", "twitter", "social media"],
    category: "social_media",
  },
  {
    src: "/images/social-media/instagram.svg",
    id: "instagram",
    name: "Instagram",
    height: 256,
    width: 256,
    keywords: ["instagram", "social media"],
    category: "social_media",
  },
  {
    src: "/images/social-media/facebook.svg",
    id: "facebook",
    name: "Facebook",
    height: 256,
    width: 256,
    keywords: ["facebook", "social media"],
    category: "social_media",
  },
];

const wallpapers: iImage[] = [
  {
    src: "/images/wallpapers/milad-fakurian-bexwsdM5BCw-unsplash.jpg",
    id: "milad-fakurian-bexwsdM5BCw-unsplash",
    name: "Wallpaper",
    height: 1920,
    width: 1459,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/milad-fakurian-E8Ufcyxz514-unsplash.jpg",
    id: "milad-fakurian-E8Ufcyxz514-unsplash",
    name: "Wallpaper",
    height: 1920,
    width: 1459,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/milad-fakurian-nY14Fs8pxT8-unsplash.jpg",
    id: "milad-fakurian-nY14Fs8pxT8-unsplash",
    name: "Wallpaper",
    height: 1920,
    width: 1440,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/codioful-formerly-gradienta-TwWTV4jElEI-unsplash.jpg",
    id: "codioful-formerly-gradienta-TwWTV4jElEI-unsplash",
    name: "Wallpaper",
    height: 1920,
    width: 3291,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/codioful-formerly-gradienta-aAcAeRyhDX0-unsplash.jpg",
    id: "codioful-formerly-gradienta-aAcAeRyhDX0-unsplash",
    name: "Wallpaper",
    height: 2400,
    width: 1600,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/codioful-formerly-gradienta-C0EW4NoDg_E-unsplash.jpg",
    id: "codioful-formerly-gradienta-C0EW4NoDg_E-unsplash",
    name: "Wallpaper",
    height: 2400,
    width: 1600,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/codioful-formerly-gradienta-4VgbJyqALXM-unsplash.jpg",
    id: "codioful-formerly-gradienta-4VgbJyqALXM-unsplash",
    name: "Wallpaper",
    height: 2400,
    width: 1600,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/codioful-formerly-gradienta-t-Rt42Wl1RQ-unsplash.jpg",
    id: "codioful-formerly-gradienta-t-Rt42Wl1RQ-unsplash",
    name: "Wallpaper",
    height: 2400,
    width: 1600,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
  {
    src: "/images/wallpapers/codioful-formerly-gradienta-TklpNHbMFW4-unsplash.jpg",
    id: "codioful-formerly-gradienta-TklpNHbMFW4-unsplash",
    name: "Wallpaper",
    height: 2400,
    width: 1600,
    keywords: ["wallpaper", "render", "digital image", "art", "graphics"],
    category: "wallpaper",
  },
];

const elements: iImage[] = [
  {
    src: "/images/elements/arrow-right-yellow.png",
    id: "arrow-right-yellow",
    name: "Arrow Right Yellow",
    height: 2000,
    width: 2000,
    keywords: ["element", "arrow", "right arrow", "yellow"],
    category: "element",
  },
  {
    src: "/images/elements/red-thick-line-stroke-arrow.png",
    id: "red-thick-line-stroke-arrow",
    name: "Red Thick Line Stroke Arrow",
    height: 1200,
    width: 1200,
    keywords: ["element", "arrow", "red"],
    category: "element",
  },
  {
    src: "/images/elements/arrow-right-red.png",
    id: "arrow-right-red",
    name: "Arrow Right Red",
    height: 600,
    width: 457,
    keywords: ["element", "arrow", "right arrow", "arrow right", "red"],
    category: "element",
  },
];

export const allImages = [...socialMediaImges, ...wallpapers, ...elements];
