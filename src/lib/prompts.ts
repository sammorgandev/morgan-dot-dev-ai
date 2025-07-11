import { PUBLIC_IMAGE_URL } from "./constants";

export const CREATIVE_PROMPTS = [
  "Create a cyberpunk-themed portfolio with neon colors, glitch effects, and futuristic typography",
  "Design a minimalist Japanese zen garden aesthetic with lots of whitespace and subtle animations",
  "Build a retro 80s synthwave style with purple/pink gradients and geometric patterns",
  "Create a dark mode brutalist design with sharp edges, monospace fonts, and high contrast",
  "Design a nature-inspired portfolio with organic shapes, earth tones, and parallax effects",
  "Build a space-themed site with stars, galaxies, and cosmic animations",
  "Create a vintage typewriter aesthetic with paper textures and classic serif fonts",
  "Design a modern glass morphism style with blurred backgrounds and transparent elements",
  "Build a retro gaming pixel art theme with 8-bit colors and blocky animations",
  "Create a luxury gold and black design with elegant typography and subtle shine effects",
  "Design a newspaper/magazine layout with columns, serif fonts, and editorial styling",
  "Build a holographic interface with iridescent colors and futuristic UI elements",
  "Create a warm coffee shop aesthetic with wood textures and cozy brown tones",
  "Design a cold arctic theme with ice blue colors and crystalline patterns",
  "Build a vibrant street art style with bold colors and graffiti-inspired elements",
  "Create a professional corporate blue theme with clean lines and business aesthetics",
  "Design a sunset gradient paradise with warm colors and tropical vibes",
  "Build a monochromatic black and white design with strong typography emphasis",
  "Create a pastel kawaii aesthetic with soft colors and cute rounded elements",
  "Design a steampunk industrial theme with brass, copper, and mechanical elements",
];

export const getRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * CREATIVE_PROMPTS.length);
  return CREATIVE_PROMPTS[randomIndex];
};

export const SYSTEM_PROMPT = (userPrompt: string) => {
  return `Create a modern, responsive portfolio website for Sam Morgan, a Software Engineer. 

IMPORTANT: Keep all the following content exactly as specified:
- Name: "Sam Morgan"
- Title: "Software Engineer"
- Current work: "Currently @ Bubble" (linked to https://bubble.io)
- Previous work: "Previously @ soiheardmusic" (linked to https://soiheardmusic.com)
- Social links: GitHub (https://github.com/sammorgan), LinkedIn (https://linkedin.com/in/sammorgan), Email (sam@sammorgan.dev)
- Profile image: Use "${PUBLIC_IMAGE_URL}/pic.jpg" as the image source
- Footer text: "Powered by v0 platform api • This site will be customized based on your prompt"

The site should maintain its core functionality but be redesigned based on this style request: "${userPrompt}"

Build this as a single-page React component using Next.js, TypeScript, and Tailwind CSS. Make it fully responsive and maintain excellent UX/UI principles. Include hover effects, smooth transitions, and modern styling patterns.

The layout should include:
1. A header with the profile image and name
2. Professional subtitle and work history
3. Social media links
4. A prominent call-to-action area
5. Footer with the specified text

Focus on making it visually appealing while keeping the exact content and links specified above.`;
};
