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

## Optimized Data Loading Architecture

This portfolio uses an optimized data loading strategy with Convex and Next.js 15:

### Key Features:

- **Centralized Queries**: Single consolidated queries for blog and portfolio data
- **preloadQuery Pattern**: Server components use `preloadQuery` for optimal performance
- **No Unnecessary Layers**: Direct integration between components and Convex
- **Consolidated Components**: Single components handle all data sections

### Data Loading Structure:

**Blog Data**:

- `api.blogPosts.getBlogData` - Returns all posts, featured posts, recent posts, and tags in one query
- Consumed by `BlogPageContent` component

**Portfolio Data**:

- `api.portfolioProjects.getPortfolioData` - Returns all projects, featured projects, and projects by status in one query
- Consumed by `ProjectPageContent` component

**Individual Items**:

- `api.blogPosts.getPostBySlug` - Single blog post by slug
- `api.portfolioProjects.getById` - Single project by ID

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

## Performance Benefits

- **Fewer Database Calls**: Single queries vs multiple separate calls
- **Faster Initial Load**: `preloadQuery` enables instant server-side rendering
- **Better Caching**: Leverages Convex's built-in query optimization
- **Reduced Bundle Size**: Eliminated unnecessary abstraction layers
- **Cleaner Architecture**: Consolidated components and data flows
