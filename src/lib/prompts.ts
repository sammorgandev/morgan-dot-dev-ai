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

Build this as a complete multi-page React application using Next.js, TypeScript, and Tailwind CSS. Make it fully responsive and maintain excellent UX/UI principles. Include hover effects, smooth transitions, and modern styling patterns.

REQUIRED PAGES AND NAVIGATION:
The site must include navigation to these pages:
1. Home - Main landing page
2. Resume - Complete professional resume
3. Projects - Portfolio of projects
4. Blog - Blog posts and articles

HOME PAGE should include:
1. A header with navigation links to Resume, Projects, and Blog
2. Profile image and name
3. Professional subtitle and work history
4. Social media links
5. A prominent call-to-action area
6. Footer with the specified text

RESUME PAGE should include:
- Complete professional resume with Sam's experience:
  * Software Engineer, AI Team @ Bubble (2025-Present)
  * Internal Bubble Developer @ Bubble (2022-2025) - user onboarding flows, account settings, app management
  * Technical Product Support Specialist @ Bubble (2021-2022)
  * Content Generation Developer @ Science4Data (2023-Present, Contract) - SEC data APIs, financial reports
  * No-Code App Coach, Freelance (2020-2021)
  * Founder & Operator @ soiheardmusic (2012-2022)
- Education: Berklee College of Music (2007-2011)
- Skills: JavaScript, TypeScript, Python, React, Next.js, AI/ML, No-Code Development
- Professional summary highlighting AI, no-code, and technical support experience

PROJECTS PAGE should include:
Dynamic data from Convex database (portfolioProjects table) with fallback to realistic sample data:
1. AI-Powered Content Generator - Next.js, OpenAI API, SEC data integration
2. Bubble App Builder Assistant - Internal tool for user onboarding  
3. SEC Data Analysis Dashboard - Python, FastAPI, financial insights
4. No-Code Learning Platform - Educational platform with interactive courses
5. Music Discovery Algorithm - ML-powered recommendation system from soiheardmusic days

Each project should show:
- Title, description, and detailed longDescription
- Technologies array with comprehensive tech stack
- GitHub links and live demo links where available
- Status (completed, in_progress, archived) with proper styling
- Featured/non-featured categorization
- Individual project detail pages at /projects/[id]

BLOG PAGE should include:
Dynamic data from Convex database (blogPosts table) with fallback to realistic sample data:
1. "Building AI-Powered Applications with Next.js and OpenAI"
2. "The Future of No-Code Development"
3. "From Music to Code: My Journey into Software Engineering"
4. "Analyzing SEC Data: Building Financial Intelligence Tools"
5. "User Onboarding: Lessons from Building Internal Tools at Bubble"
6. "Machine Learning in Music: Building Recommendation Systems"

Each blog post should include:
- Title, excerpt, and full markdown content
- Author (Sam Morgan), publication date, reading time
- Tags array for categorization
- Featured/recent post sections
- Individual blog post detail pages at /blog/[slug]

DATA CONNECTION REQUIREMENTS:
- Import Convex client: useQuery from "convex/react"
- Import API: api from "convex/_generated/api"
- Use queries: api.portfolioProjects.getAllProjects and api.blogPosts.getAllPosts
- Implement fallback: const displayData = convexData || sampleData
- Handle loading states with skeleton UI or sample data
- NOTE: For iframe deployments, Convex connections may fail due to cross-origin restrictions
- Always provide comprehensive sample data as fallback

TECHNICAL REQUIREMENTS:
- Use Next.js App Router with proper routing (/resume, /projects, /blog, /projects/[id], /blog/[slug])
- Implement proper TypeScript interfaces for all data structures
- Use Tailwind CSS for styling with consistent design system
- Include hover effects, transitions, and responsive design
- Maintain navigation consistency across all pages
- Use lucide-react icons throughout
- Follow the same visual style and color scheme across all pages

CONVEX INTEGRATION:
- Wrap app with ConvexProvider using NEXT_PUBLIC_CONVEX_URL
- Import useQuery from "convex/react" for data fetching
- Use api.portfolioProjects.getAllProjects for projects data
- Use api.blogPosts.getAllPosts for blog data
- Implement proper loading states and error handling
- Provide fallback sample data for cross-origin scenarios
- Handle both empty states and loading states gracefully

CROSS-ORIGIN CONSIDERATIONS:
- For iframe deployment (v0 generated sites), Convex connections may fail
- Always include comprehensive sample data as fallback
- Use conditional rendering: {convexData?.length > 0 ? convexData : sampleData}
- Test both connected and disconnected states
- Ensure site works perfectly even without Convex connection

The design should be cohesive across all pages while adapting to the specific style request: "${userPrompt}"

Focus on making it visually appealing, professional, and fully functional with realistic sample content that reflects Sam's actual experience and expertise.`;
};
