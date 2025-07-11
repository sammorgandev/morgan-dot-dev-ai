import { BASE_URL } from "./constants";

export const SYSTEM_PROMPT = (userPrompt: string) => {
  return `Create a modern, responsive portfolio website for Sam Morgan, a Software Engineer. 

IMPORTANT: Keep all the following content exactly as specified:
- Name: "Sam Morgan"
- Title: "Software Engineer"
- Current work: "Currently @ Bubble" (linked to https://bubble.io)
- Previous work: "Previously @ soiheardmusic" (linked to https://soiheardmusic.com)
- Social links: GitHub (https://github.com/sammorgan), LinkedIn (https://linkedin.com/in/sammorgan), Email (sam@sammorgan.dev)
- Profile image: Use "${BASE_URL}/pic.jpg" as the image source
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
