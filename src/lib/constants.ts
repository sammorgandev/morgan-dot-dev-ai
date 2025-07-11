export const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NODE_ENV === "production"
  ? "https://morgan.dev"
  : "http://localhost:3000";

export const DESIGN_KEYWORDS = [
  "design",
  "style",
  "look",
  "feel",
  "theme",
  "color",
  "layout",
  "modern",
  "minimal",
  "sleek",
  "dark",
  "light",
  "bright",
  "colorful",
  "professional",
  "creative",
  "clean",
  "elegant",
  "bold",
  "subtle",
  "animated",
  "gradient",
  "background",
  "font",
  "typography",
  "spacing",
  "card",
  "button",
  "navigation",
  "header",
  "footer",
  "sidebar",
  "gallery",
  "grid",
];

export const PROGRESS_MESSAGES = [
  "Analyzing your design preferences...",
  "Generating custom layouts...",
  "Applying your style choices...",
  "Optimizing components...",
  "Adding interactive elements...",
  "Finalizing your personalized site...",
  "Almost ready...",
];

export const DESIGN_EXAMPLES = [
  "Make it dark and modern with gradients",
  "Bright colorful theme with animated elements",
  "Clean minimal design with subtle shadows",
  "Bold typography with a professional layout",
  "Glassmorphism style with blur effects",
  "Retro 80s theme with neon colors",
  "Elegant black and white with gold accents",
  "Cyberpunk aesthetic with glowing elements",
];
