# Portfolio Setup Instructions

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up Convex:**

   ```bash
   npx convex dev
   ```

   This will create your Convex project and start the development server.

3. **Seed the database:**
   Once Convex is running, seed the database with sample data:

   ```bash
   npx convex run seedData:seedAllData
   ```

4. **Enable Convex connections:**
   Uncomment the Convex imports in the following files:

   - `src/app/projects/page.tsx`
   - `src/app/projects/[id]/page.tsx`
   - `src/app/blog/page.tsx`
   - `src/app/blog/[slug]/page.tsx`

   Replace the commented lines:

   ```typescript
   // import { useQuery } from "convex/react";
   // import { api } from "../../../convex/_generated/api";
   ```

   With:

   ```typescript
   import { useQuery } from "convex/react";
   import { api } from "../../../convex/_generated/api";
   ```

   And update the data loading:

   ```typescript
   // Replace this:
   // const projects = useQuery(api.portfolioProjects.getAllProjects);

   // With this:
   const projects = useQuery(api.portfolioProjects.getAllProjects);
   const displayProjects = projects || sampleProjects;
   ```

## Database Schema

The portfolio uses Convex with the following tables:

### portfolioProjects

- Complete project information with technologies, descriptions, and links
- Featured/status categorization
- GitHub and live demo URLs

### blogPosts

- Full blog posts with markdown content
- Tags and categorization
- Author information and reading time
- Published/featured status

### Sample Data

The seed script creates:

- 5 realistic portfolio projects showcasing Sam's work
- 6 detailed blog posts covering technical topics
- All data matches Sam Morgan's actual experience and expertise

## Cross-Site Origin Considerations

For generated sites in iframes, the Convex connection may face CORS issues. Consider:

1. **Environment Variables**: Ensure NEXT_PUBLIC_CONVEX_URL is properly set
2. **Convex Auth**: May need to configure public access for read-only queries
3. **Alternative**: Pre-generate static data for iframe deployments

## Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:3000` with:

- `/` - Home page with AI generation form
- `/resume` - Complete professional resume
- `/projects` - Portfolio projects with detail pages
- `/blog` - Blog posts with full article pages

## Generated Sites

When sites are generated via v0, they should:

1. Include all three main sections (resume, projects, blog)
2. Connect to Convex for live data (if possible)
3. Fall back to sample data for iframe environments
4. Maintain navigation and styling consistency
