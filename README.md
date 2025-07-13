# Sam Morgan's Software Engineering Portfolio

A modern, AI-powered portfolio website built with Next.js 15, React 19, and TypeScript. This application demonstrates advanced full-stack development skills, real-time AI integration, and modern web development best practices.

## 🚀 Features

### Core Functionality
- **AI-Powered Site Customization**: Dynamic website generation using v0 SDK
- **Real-time Chat Interface**: Interactive conversation system for site modifications
- **Live Preview System**: Instant preview of generated designs with iframe rendering
- **GitHub Integration**: Automated deployment and sync with GitHub Pages
- **Screenshot Capture**: Automated screenshot generation using Puppeteer
- **Blog & Portfolio Management**: Full CMS for blog posts and portfolio projects

### Technical Highlights
- **Next.js 15 App Router**: Server-side rendering and modern routing
- **React 19**: Latest React features with concurrent rendering
- **TypeScript**: Full type safety throughout the application
- **Convex Database**: Real-time database with optimistic updates
- **Zustand State Management**: Efficient client-side state management
- **Tailwind CSS v4**: Modern styling with utility-first approach
- **Radix UI Components**: Accessible, customizable UI components

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom components
- **Components**: Radix UI for accessible components
- **State Management**: Zustand with domain-specific stores
- **Icons**: Lucide React icons

### Backend & Database
- **Database**: Convex (real-time database)
- **Authentication**: Convex Auth integration
- **File Storage**: Convex storage for images and files
- **API Integration**: v0 SDK for AI-powered generation

### Development Tools
- **Language**: TypeScript with strict configuration
- **Linting**: ESLint with Next.js configuration
- **Code Quality**: Prettier, strict TypeScript rules
- **Deployment**: Vercel with automatic deployments

### External Services
- **AI Generation**: v0 SDK for dynamic content creation
- **Screenshot Service**: Puppeteer for automated screenshots
- **Version Control**: GitHub with automated workflows
- **Deployment**: Vercel for production hosting

## 🏗️ Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog functionality
│   ├── projects/          # Portfolio projects
│   ├── resume/            # Resume page
│   ├── sandbox/           # Experimental features
│   └── actions.ts         # Server actions
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── blog/             # Blog-specific components
│   ├── projects/         # Project-specific components
│   └── generated-view/   # AI-generated content components
├── lib/                   # Utility functions and configurations
│   ├── stores/           # Zustand store modules
│   ├── constants.ts      # Application constants
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── hooks/                # Custom React hooks
```

### Key Design Patterns
- **Server Components**: Optimized data fetching with React Server Components
- **Client Components**: Strategic use of client-side interactivity
- **Server Actions**: Type-safe server-side operations
- **Optimistic Updates**: Immediate UI feedback with Convex
- **Error Boundaries**: Graceful error handling and recovery

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account (for database)
- v0 SDK access (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sammorgan/morgan-dot-dev.git
   cd morgan-dot-dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CONVEX_DEPLOY_KEY=your_convex_deploy_key
   V0_API_KEY=your_v0_api_key
   GITHUB_TOKEN=your_github_token
   ```

4. **Set up Convex database**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features Demonstrated

### Software Engineering Skills
- **Full-Stack Development**: Complete application from database to deployment
- **Real-time Systems**: Live chat and database synchronization
- **API Integration**: Complex third-party service integration
- **Performance Optimization**: Code splitting, lazy loading, and caching
- **Type Safety**: Comprehensive TypeScript implementation
- **Testing**: Component and integration testing strategies

### Modern Web Development
- **Responsive Design**: Mobile-first, accessible interface
- **Progressive Enhancement**: Works without JavaScript
- **SEO Optimization**: Server-side rendering for better search ranking
- **Performance**: Web Vitals optimization and monitoring
- **Security**: XSS protection, CSRF mitigation, secure headers

### DevOps & Deployment
- **CI/CD Pipelines**: Automated testing and deployment
- **Version Control**: Git workflow with feature branches
- **Monitoring**: Error tracking and performance monitoring
- **Scalability**: Database optimization and caching strategies

## 📊 Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Dynamic imports for better loading performance
- **Tree Shaking**: Elimination of unused code
- **Module Federation**: Shared dependencies optimization
- **Compression**: Gzip and Brotli compression

### Database Optimization
- **Query Optimization**: Efficient Convex queries with proper indexing
- **Caching**: Strategic caching for frequently accessed data
- **Real-time Updates**: Optimistic updates for better UX
- **Connection Pooling**: Efficient database connection management

### UI/UX Optimization
- **Lazy Loading**: Images and components loaded on demand
- **Skeleton Loading**: Improved perceived performance
- **Error Boundaries**: Graceful error handling
- **Accessibility**: WCAG 2.1 compliance

## 🔧 Configuration

### Next.js Configuration
The `next.config.ts` includes:
- Bundle analyzer integration
- Image optimization settings
- Security headers configuration
- Performance optimizations

### TypeScript Configuration
Strict TypeScript setup with:
- Exact optional property types
- Unused parameter detection
- Consistent file casing
- Modern ES2020 target

## 🚀 Deployment

### Vercel Deployment
```bash
npm run build
npm run start
```

### Environment Setup
- Production environment variables
- Database migrations
- SSL certificate configuration
- CDN optimization

## 🤝 Contributing

This is a portfolio project demonstrating software engineering skills. However, contributions are welcome for:
- Bug fixes
- Performance improvements
- Documentation updates
- Feature suggestions

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📈 Future Roadmap

### Planned Features
- **Advanced AI Integration**: More sophisticated AI-powered features
- **Analytics Dashboard**: Comprehensive visitor and interaction analytics
- **CMS Enhancement**: Advanced content management capabilities
- **Mobile App**: React Native companion application
- **API Documentation**: OpenAPI specification and interactive docs

### Technical Improvements
- **Micro-frontends**: Modular architecture for scalability
- **GraphQL Integration**: Enhanced data fetching capabilities
- **WebSocket Support**: Real-time collaboration features
- **Service Workers**: Offline functionality and caching

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

**Sam Morgan** - Software Engineer at Bubble.io
- **GitHub**: [@sammorgan](https://github.com/sammorgan)
- **LinkedIn**: [sammorgan](https://linkedin.com/in/sammorgan)
- **Email**: [sam@sammorgan.dev](mailto:sam@sammorgan.dev)
- **Portfolio**: [morgan.dev](https://morgan.dev)

### Professional Background
- **Current**: Software Engineer at Bubble.io
- **Previous**: Technical Lead at soiheardmusic.com
- **Expertise**: Full-stack development, AI integration, DevOps, scalable systems

This portfolio demonstrates proficiency in modern web development, system architecture, and software engineering best practices. The codebase serves as a comprehensive example of production-ready Next.js applications with real-time features and AI integration.

---

*Built with ❤️ using Next.js 15, React 19, and TypeScript*
