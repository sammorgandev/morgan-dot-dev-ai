import { mutation } from "./_generated/server";

// Seed portfolio projects
export const seedPortfolioProjects = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    const projects = [
      {
        title: "AI-Powered Content Generator",
        description:
          "Full-stack application that generates marketing content using GPT-4 and custom prompts",
        longDescription:
          "Built a comprehensive content generation platform for Science4Data clients, featuring custom prompt engineering, content optimization, and bulk generation capabilities. The system processes SEC data to create financial reports and analysis documents automatically. Includes advanced features like content personalization, A/B testing for different prompt strategies, and integration with multiple LLM providers for optimal results.",
        technologies: [
          "Next.js",
          "OpenAI API",
          "PostgreSQL",
          "Tailwind CSS",
          "Vercel",
          "TypeScript",
          "Prisma",
        ],
        githubUrl: "https://github.com/sammorgan/content-generator",
        liveUrl: "https://content-generator-demo.vercel.app",
        imageUrl: "/project-1.jpg",
        featured: true,
        status: "completed" as const,
        startDate: "2023-06",
        endDate: "2023-12",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Bubble App Builder Assistant",
        description:
          "Internal tool for streamlining Bubble app development and user onboarding",
        longDescription:
          "Developed an internal assistant that helps new Bubble users navigate the platform more effectively. Features include guided tutorials, automated app setup, and intelligent suggestions for app architecture based on user requirements. The tool reduced new user onboarding time by 40% and improved user retention during the critical first-week period. Integrated with Bubble's existing workflow system and user management APIs.",
        technologies: [
          "Bubble",
          "JavaScript",
          "API Integrations",
          "Zapier",
          "Airtable",
          "React",
          "Node.js",
        ],
        githubUrl: undefined,
        liveUrl: "https://bubble.io",
        imageUrl: "/project-2.jpg",
        featured: true,
        status: "completed" as const,
        startDate: "2022-03",
        endDate: "2024-11",
        createdAt: now - 1000000,
        updatedAt: now - 1000000,
      },
      {
        title: "SEC Data Analysis Dashboard",
        description:
          "Real-time dashboard for analyzing SEC filings and generating financial insights",
        longDescription:
          "Created a comprehensive dashboard that ingests SEC EDGAR data, processes it through custom algorithms, and presents actionable insights for financial companies. Features include automated report generation, trend analysis, and compliance monitoring. The system processes over 10,000 filings daily and provides real-time alerts for significant market events. Built custom NLP models to extract key financial metrics and sentiment analysis from filing documents.",
        technologies: [
          "Python",
          "FastAPI",
          "React",
          "PostgreSQL",
          "SEC APIs",
          "Docker",
          "Redis",
          "Celery",
        ],
        githubUrl: "https://github.com/sammorgan/sec-analyzer",
        liveUrl: undefined,
        imageUrl: "/project-3.jpg",
        featured: false,
        status: "completed" as const,
        startDate: "2023-01",
        endDate: "2023-08",
        createdAt: now - 2000000,
        updatedAt: now - 2000000,
      },
      {
        title: "No-Code Learning Platform",
        description:
          "Educational platform teaching no-code development through interactive courses",
        longDescription:
          "Built a comprehensive learning platform that teaches no-code development through hands-on projects. Features include interactive tutorials, progress tracking, community features, and certification programs. The platform serves over 1,000 active learners and includes courses on multiple no-code platforms including Bubble, Webflow, and Zapier. Integrated with Stripe for subscription management and built a custom LMS with video streaming capabilities.",
        technologies: [
          "Next.js",
          "Supabase",
          "Tailwind CSS",
          "Stripe",
          "Vercel",
          "TypeScript",
          "Mux",
        ],
        githubUrl: "https://github.com/sammorgan/nocode-academy",
        liveUrl: "https://nocode-academy.dev",
        imageUrl: "/project-4.jpg",
        featured: false,
        status: "in_progress" as const,
        startDate: "2024-01",
        endDate: undefined,
        createdAt: now - 3000000,
        updatedAt: now - 3000000,
      },
      {
        title: "Music Discovery Algorithm",
        description:
          "Machine learning algorithm for music recommendation based on listening patterns",
        longDescription:
          "Developed during my time at soiheardmusic, this algorithm analyzes listening patterns, musical features, and user preferences to provide personalized music recommendations. Implemented collaborative filtering and content-based filtering techniques, processing audio features using librosa and building recommendation models with scikit-learn. The system achieved 85% user satisfaction rate and increased average listening time by 60%. Integrated with Spotify API for real-time music data and built a custom music similarity engine.",
        technologies: [
          "Python",
          "Scikit-learn",
          "Spotify API",
          "MongoDB",
          "Flask",
          "librosa",
          "pandas",
        ],
        githubUrl: "https://github.com/sammorgan/music-discovery",
        liveUrl: undefined,
        imageUrl: "/project-5.jpg",
        featured: false,
        status: "archived" as const,
        startDate: "2018-06",
        endDate: "2020-12",
        createdAt: now - 4000000,
        updatedAt: now - 4000000,
      },
    ];

    // Insert projects
    for (const project of projects) {
      await ctx.db.insert("portfolioProjects", project);
    }

    return { success: true, projectsCreated: projects.length };
  },
});

// Seed blog posts
export const seedBlogPosts = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    const posts = [
      {
        title: "Building AI-Powered Applications with Next.js and OpenAI",
        slug: "ai-powered-apps-nextjs-openai",
        excerpt:
          "Learn how to integrate OpenAI's GPT models into your Next.js applications to create intelligent, responsive user experiences that can understand and generate human-like text.",
        content:
          "# Building AI-Powered Applications with Next.js and OpenAI\n\nThe integration of AI capabilities into web applications has become increasingly accessible with the rise of powerful APIs like OpenAI's GPT models. In this comprehensive guide, we'll explore how to build intelligent applications using Next.js and OpenAI's API.\n\n## Getting Started\n\nFirst, you'll need to set up your development environment with the necessary dependencies:\n\n```bash\nnpm install openai next react typescript\n```\n\n## Setting Up OpenAI Integration\n\nThe key to successful AI integration is proper API management and response handling. Here's how to structure your OpenAI calls:\n\n```javascript\nimport OpenAI from 'openai';\n\nconst openai = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n});\n\nexport async function generateContent(prompt) {\n  const response = await openai.chat.completions.create({\n    model: \"gpt-4\",\n    messages: [{ role: \"user\", content: prompt }],\n    max_tokens: 1000,\n  });\n  \n  return response.choices[0].message.content;\n}\n```\n\n## Best Practices\n\n1. **Error Handling**: Always implement robust error handling for API calls\n2. **Rate Limiting**: Implement proper rate limiting to avoid hitting API limits\n3. **Caching**: Cache responses when appropriate to improve performance\n4. **User Experience**: Provide loading states and streaming responses when possible\n\n## Real-World Implementation\n\nIn my work with Science4Data, we built a content generation platform that processes SEC data and creates financial reports automatically. The key was creating effective prompts that could understand complex financial data and generate accurate, readable reports.\n\nThe system now processes thousands of documents daily and has significantly reduced the time required for financial analysis tasks.\n\n## Conclusion\n\nAI integration in web applications opens up incredible possibilities for creating intelligent, responsive user experiences. With proper implementation and attention to best practices, you can build applications that truly understand and assist your users.",
        author: "Sam Morgan",
        tags: ["AI", "Next.js", "OpenAI", "TypeScript", "Web Development"],
        published: true,
        featured: true,
        readingTime: 8,
        publishedAt: now - 86400000, // 1 day ago
        createdAt: now - 86400000,
        updatedAt: now - 86400000,
      },
      {
        title: "The Future of No-Code Development",
        slug: "future-of-no-code-development",
        excerpt:
          "Exploring how no-code platforms are democratizing software development and what it means for the future of programming, based on my experience at Bubble.",
        content:
          "# The Future of No-Code Development\n\nHaving worked extensively with no-code platforms, particularly during my time at Bubble, I've witnessed firsthand how these tools are reshaping the software development landscape. The no-code movement isn't just a trend—it's a fundamental shift in how we think about building applications.\n\n## The Current State\n\nNo-code platforms have evolved from simple website builders to sophisticated development environments capable of creating complex applications. At Bubble, I've seen users build everything from simple landing pages to full-scale SaaS applications with millions of users.\n\n## Key Advantages\n\n### 1. Speed of Development\nNo-code platforms can reduce development time by 80-90% for many types of applications. What would take months with traditional development can be accomplished in weeks or even days.\n\n### 2. Accessibility\nThese platforms democratize software development, allowing non-programmers to bring their ideas to life. This has opened up innovation opportunities across industries.\n\n### 3. Rapid Prototyping\nThe ability to quickly test and iterate on ideas has revolutionized the product development process.\n\n## Challenges and Limitations\n\nWhile no-code platforms are powerful, they do have limitations:\n\n- **Customization Constraints**: Some advanced features may require custom code\n- **Scalability Concerns**: Performance optimization can be challenging\n- **Vendor Lock-in**: Migrating between platforms can be difficult\n\n## The Future Landscape\n\nI predict several key trends will shape the future of no-code development:\n\n1. **AI Integration**: AI will make no-code platforms even more intuitive\n2. **Improved Performance**: Next-generation platforms will rival traditional development performance\n3. **Better Integration**: Seamless connections between no-code and traditional development workflows\n4. **Industry Specialization**: Platforms tailored to specific industries and use cases\n\n## Conclusion\n\nNo-code development represents a paradigm shift that will continue to grow. Rather than replacing traditional development, it's expanding the pool of people who can build software, ultimately accelerating innovation across all industries.\n\nThe future belongs to those who can effectively leverage both no-code platforms and traditional development, using the right tool for each specific challenge.",
        author: "Sam Morgan",
        tags: [
          "No-Code",
          "Bubble",
          "Development",
          "Future",
          "Software Engineering",
        ],
        published: true,
        featured: true,
        readingTime: 12,
        publishedAt: now - 172800000, // 2 days ago
        createdAt: now - 172800000,
        updatedAt: now - 172800000,
      },
      {
        title: "From Music to Code: My Journey into Software Engineering",
        slug: "music-to-code-journey",
        excerpt:
          "A personal story about transitioning from running a music business to becoming a software engineer, and the unexpected connections between these two worlds.",
        content:
          "# From Music to Code: My Journey into Software Engineering\n\nTen years ago, if you had told me I'd be writing code for a living, I would have laughed. I was deep in the music industry, running soiheardmusic, completely absorbed in the creative and business sides of music. But life has a way of surprising you, and my journey from music to software engineering has been one of the most rewarding transitions I've ever made.\n\n## The Music Years (2012-2022)\n\nFor a decade, I lived and breathed music. soiheardmusic wasn't just a business—it was my passion project, my creative outlet, and my full-time obsession. I learned about content creation, audience building, digital marketing, and the complexities of running a creative business in the digital age.\n\nWhat I didn't realize at the time was that I was developing skills that would prove invaluable in tech:\n- **Problem-solving**: Every day brought new challenges in the music industry\n- **User experience thinking**: Understanding what audiences wanted and needed\n- **Systems thinking**: Managing complex workflows and processes\n- **Communication**: Collaborating with artists, venues, and fans\n\n## The Transition Period\n\nAround 2020, I started becoming interested in no-code development. Initially, it was just a way to build better tools for soiheardmusic—websites, fan engagement platforms, data management systems. But as I dove deeper, I discovered something unexpected: I loved the logical, systematic approach to solving problems through code.\n\nThe transition wasn't immediate. I spent 2020-2021 coaching others in no-code development while still running soiheardmusic. This period taught me how to explain complex technical concepts to non-technical people—a skill that would prove invaluable in my future roles.\n\n## Finding My Place at Bubble\n\nWhen I joined Bubble's success team in 2021, it felt like coming home. Here was a company that understood the power of democratizing software development, of giving non-programmers the tools to build their ideas. My background in music and no-code coaching made me uniquely qualified to help users navigate the platform.\n\nMoving from success to the product team, and then to software engineering, was a natural progression. Each role built on the previous one, deepening my understanding of both the technical and human sides of software development.\n\n## The Unexpected Connections\n\nThe more I've worked in software engineering, the more I've realized how much music and code have in common:\n\n### Pattern Recognition\nMusic is all about patterns—chord progressions, rhythmic patterns, song structures. Code is similarly pattern-based, with design patterns, algorithmic patterns, and architectural patterns.\n\n### Creative Problem-Solving\nBoth music and software engineering require creative solutions to complex problems. Whether you're arranging a song or architecting a system, you're looking for elegant solutions that work both technically and aesthetically.\n\n### Collaboration\nModern software development, like music production, is highly collaborative. You're working with different specialists—designers, product managers, other engineers—much like working with musicians, producers, and sound engineers.\n\n### Iteration and Refinement\nBoth fields require constant iteration. A song goes through multiple drafts, just as code goes through multiple refactors and improvements.\n\n## Advice for Career Changers\n\nIf you're considering a similar transition, here's what I've learned:\n\n1. **Your previous experience is valuable**: Don't dismiss your background. The skills you've developed in other fields often translate in unexpected ways.\n\n2. **Start with your interests**: I started with no-code because it solved problems I had in music. Find the intersection of your current interests and technology.\n\n3. **Build things**: The best way to learn is by building. Start with small projects that solve real problems you have.\n\n4. **Don't be afraid to start over**: I was 30+ when I made this transition. It's never too late to change directions.\n\n5. **Embrace the learning curve**: Technology moves fast, and there's always more to learn. That's not a bug—it's a feature.\n\n## Looking Forward\n\nNow, as I work on AI initiatives at Bubble, I'm excited about the future possibilities. The intersection of AI and no-code development has the potential to make software creation even more accessible and creative.\n\nMy music background continues to influence my approach to software engineering. I think about user experience like I think about audience experience. I approach system design with the same attention to flow and harmony that I brought to music curation.\n\n## Final Thoughts\n\nThe journey from music to code has been anything but linear, and that's exactly what made it valuable. Every detour, every skill learned in a different context, every challenge overcome in the music industry—it all contributed to making me a better software engineer.\n\nIf you're considering a career change, especially into tech, remember that your unique background is an asset, not a liability. The world needs diverse perspectives in software development, and your experience in other fields might be exactly what the industry needs.\n\nThe future belongs to those who can bridge different worlds, bringing creativity and fresh perspectives to technical challenges. Whether you're coming from music, business, art, or any other field, there's a place for you in software engineering.",
        author: "Sam Morgan",
        tags: [
          "Career",
          "Music",
          "Software Engineering",
          "Personal",
          "No-Code",
        ],
        published: true,
        featured: false,
        readingTime: 6,
        publishedAt: now - 259200000, // 3 days ago
        createdAt: now - 259200000,
        updatedAt: now - 259200000,
      },
      {
        title: "Analyzing SEC Data: Building Financial Intelligence Tools",
        slug: "sec-data-analysis-tools",
        excerpt:
          "Deep dive into working with SEC EDGAR data to build automated financial analysis and reporting tools for investment firms, including technical challenges and solutions.",
        content:
          "# Analyzing SEC Data: Building Financial Intelligence Tools\n\nWorking with SEC data has been one of the most challenging and rewarding aspects of my contract work with Science4Data. The SEC's EDGAR database contains a treasure trove of financial information, but extracting meaningful insights from it requires sophisticated tools and techniques.\n\n## Understanding the SEC Data Landscape\n\nThe SEC requires public companies to file various forms that provide detailed financial information:\n- **10-K**: Annual reports with comprehensive business overviews\n- **10-Q**: Quarterly reports with unaudited financial statements\n- **8-K**: Current reports for major events\n- **13F**: Quarterly reports for institutional investment managers\n\nEach filing type contains different structured and unstructured data that requires different processing approaches.\n\n## Technical Challenges\n\n### Data Volume and Velocity\nThe EDGAR database receives thousands of filings daily. Our system needed to process this volume in real-time while maintaining accuracy and reliability.\n\n### Data Structure Complexity\nSEC filings use XBRL (eXtensible Business Reporting Language) format, which can be complex to parse. Additionally, many filings contain both structured XBRL data and unstructured text that requires NLP processing.\n\n### Data Quality Issues\nReal-world financial data is messy. Companies may report the same metrics using different taxonomies, and historical data often requires normalization.\n\n## Our Technical Solution\n\nWe built a comprehensive system that processes SEC filings and extracts key financial metrics automatically. The system handles data ingestion, parsing, analysis, and API delivery.\n\n## Real-World Impact\n\nThe tools we built had significant impact for our financial services clients:\n\n### Automated Screening\n- **Time Savings**: Reduced manual analysis time by 75%\n- **Coverage**: Enabled analysis of 5000+ companies vs. 200 manual reviews\n- **Consistency**: Eliminated human bias in initial screening\n\n### Risk Monitoring\n- **Early Warning**: Identified potential issues 2-3 quarters before traditional analysis\n- **Compliance**: Automated regulatory change detection\n- **Portfolio Management**: Real-time risk assessment for investment portfolios\n\n### Competitive Intelligence\n- **Market Analysis**: Automated competitor benchmarking\n- **Trend Identification**: Industry-wide pattern recognition\n- **Investment Opportunities**: Systematic identification of undervalued companies\n\n## Lessons Learned\n\n### Technical Insights\n1. **Data Quality is King**: Spent 60% of development time on data cleaning and validation\n2. **Incremental Processing**: Batch processing was more reliable than real-time for complex analysis\n3. **Caching Strategy**: Intelligent caching reduced API calls by 90%\n4. **Error Handling**: Robust error handling was crucial for production stability\n\n### Business Insights\n1. **Domain Expertise**: Financial domain knowledge was as important as technical skills\n2. **User Feedback**: Regular feedback from analysts improved feature prioritization\n3. **Performance Matters**: Sub-second response times were critical for user adoption\n4. **Visualization**: Good data visualization was essential for insight communication\n\n## Future Opportunities\n\nThe intersection of AI and financial data analysis presents exciting opportunities:\n\n### Advanced NLP\n- **Document Similarity**: Comparing filings across companies and time periods\n- **Anomaly Detection**: Identifying unusual patterns in financial reporting\n- **Automated Summarization**: Generating executive summaries of complex filings\n\n### Predictive Analytics\n- **Bankruptcy Prediction**: Early warning systems for financial distress\n- **Earnings Forecasting**: Predicting financial performance based on historical patterns\n- **Market Movement**: Correlating filing data with stock price movements\n\n### Regulatory Technology\n- **Compliance Monitoring**: Automated regulatory requirement checking\n- **Audit Trail**: Comprehensive documentation of analytical decisions\n- **Regulatory Reporting**: Automated generation of regulatory reports\n\n## Conclusion\n\nWorking with SEC data has taught me that the most valuable insights often come from the intersection of domain expertise and technical innovation. The financial industry generates enormous amounts of data, but transforming that data into actionable intelligence requires sophisticated tools and deep understanding of both the technical and business contexts.\n\nThe future of financial analysis lies in automated, intelligent systems that can process vast amounts of data while providing human analysts with the insights they need to make better decisions. Our work at Science4Data represents just the beginning of this transformation.\n\nFor developers interested in financial technology, I'd recommend starting with the SEC's public APIs and focusing on solving real problems for financial professionals. The intersection of finance and technology offers endless opportunities for innovation and impact.",
        author: "Sam Morgan",
        tags: ["Finance", "SEC", "Data Analysis", "Python", "API", "NLP"],
        published: true,
        featured: false,
        readingTime: 10,
        publishedAt: now - 345600000, // 4 days ago
        createdAt: now - 345600000,
        updatedAt: now - 345600000,
      },
      {
        title:
          "User Onboarding: Lessons from Building Internal Tools at Bubble",
        slug: "user-onboarding-bubble-lessons",
        excerpt:
          "Key insights and best practices for creating effective user onboarding experiences, drawn from my work on Bubble's internal tools and user success initiatives.",
        content:
          "# User Onboarding: Lessons from Building Internal Tools at Bubble\n\nDuring my time at Bubble, I had the unique opportunity to work on both sides of the user experience equation: helping users as part of the success team and building the tools that shape their first interactions with the platform. This dual perspective taught me invaluable lessons about user onboarding that apply far beyond no-code platforms.\n\n## The Stakes of First Impressions\n\nUser onboarding is make-or-break for any platform. Our data at Bubble showed that users who completed specific onboarding milestones in their first week were 5x more likely to become long-term active users. This stark reality drove every decision we made about the onboarding experience.\n\n## Key Principles We Discovered\n\n### 1. Progressive Disclosure\nRather than overwhelming users with everything at once, we learned to reveal features progressively based on user needs and skill level.\n\n**Bad Approach**: Show all features in a comprehensive tour\n**Good Approach**: Introduce features just-in-time when users need them\n\n### 2. Immediate Value Delivery\nUsers need to see value quickly, preferably within the first 5 minutes of using the platform.\n\n**Implementation**: We created \"quick win\" templates that let users build and deploy a simple app in under 10 minutes.\n\n### 3. Contextual Help\nGeneric help documentation fails. Users need assistance that's specific to their current task and context.\n\n**Solution**: We built an intelligent help system that provided relevant guidance based on user actions and current screen context.\n\n## The Technical Implementation\n\nWe implemented comprehensive analytics to understand where users got stuck and built smart onboarding flows that adapted to user behavior.\n\n## Real-World Results\n\n### Before Our Improvements\n- **Time to First App**: 45 minutes average\n- **Week 1 Completion Rate**: 23%\n- **User Satisfaction**: 6.2/10\n- **Support Tickets**: 15% of new users created tickets\n\n### After Implementation\n- **Time to First App**: 12 minutes average\n- **Week 1 Completion Rate**: 67%\n- **User Satisfaction**: 8.4/10\n- **Support Tickets**: 4% of new users created tickets\n\n## Specific Techniques That Worked\n\n### 1. The \"Aha Moment\" Framework\nWe identified that users had their \"aha moment\" when they successfully deployed their first app to a live URL. Everything in our onboarding was designed to get users to this moment as quickly as possible.\n\n### 2. Failure Recovery\nInstead of dead ends, we built recovery paths for every possible failure point:\n- **Stuck on a step**: Offered alternative approaches\n- **Made an error**: Provided one-click fixes\n- **Abandoned flow**: Triggered re-engagement emails with specific help\n\n### 3. Personalized Pathways\nWe created different onboarding paths based on user-declared goals:\n- **Entrepreneurs**: Focused on business app templates\n- **Developers**: Emphasized advanced features and integrations\n- **Learners**: Provided comprehensive tutorials and theory\n\n### 4. Social Proof Integration\nWe showed users examples of successful apps built by people with similar backgrounds, making success feel achievable.\n\n## Common Pitfalls to Avoid\n\n### 1. Feature Overload\n**Mistake**: Trying to showcase every feature during onboarding\n**Fix**: Focus on core value proposition only\n\n### 2. One-Size-Fits-All\n**Mistake**: Using the same onboarding for all user types\n**Fix**: Segment users and customize experiences\n\n### 3. Ignoring Mobile\n**Mistake**: Designing onboarding only for desktop\n**Fix**: Ensure mobile experience is equally smooth\n\n### 4. Lack of Progress Indicators\n**Mistake**: Users don't know how much onboarding remains\n**Fix**: Clear progress indicators and time estimates\n\n## Advanced Techniques\n\n### Behavioral Triggers\nWe implemented smart triggers based on user behavior:\n- **Idle Detection**: Gentle nudges when users seemed stuck\n- **Success Celebration**: Immediate positive reinforcement for completed actions\n- **Smart Interruptions**: Contextual tips at optimal moments\n\n### A/B Testing Framework\nWe constantly tested different approaches:\n- **Copy Variations**: Different explanations for the same concepts\n- **Flow Sequences**: Alternative step orders\n- **Visual Design**: Different UI approaches to the same functionality\n\n### Feedback Loops\nWe built multiple feedback collection points:\n- **Micro-surveys**: Single-question feedback at key moments\n- **Exit Surveys**: Understanding why users left\n- **Success Stories**: Capturing what worked well\n\n## Measuring Success\n\n### Key Metrics We Tracked\n1. **Time to Value**: How long until users achieve their first success\n2. **Completion Rates**: Percentage completing each onboarding step\n3. **Feature Adoption**: Which features users actually use post-onboarding\n4. **Long-term Retention**: 30/60/90-day retention rates\n5. **User Satisfaction**: NPS scores and qualitative feedback\n\n### Leading vs. Lagging Indicators\n- **Leading**: Step completion rates, time spent per step, help requests\n- **Lagging**: User retention, feature adoption, subscription conversions\n\n## Lessons for Other Platforms\n\n### 1. Onboarding Never Ends\nGreat onboarding extends beyond the first session. We implemented progressive onboarding that continued to guide users as they grew more sophisticated.\n\n### 2. Support Team Insights are Gold\nOur support team's feedback was invaluable for identifying friction points. Regular collaboration between engineering and support led to breakthrough improvements.\n\n### 3. User Research is Essential\nWe conducted regular user interviews and usability testing. Watching real users struggle with our interface was humbling but incredibly valuable.\n\n### 4. Technical Debt in Onboarding is Expensive\nPoor onboarding affects every new user. We learned to prioritize onboarding improvements even when they weren't the most exciting feature work.\n\n## The Future of Onboarding\n\nLooking ahead, I see several trends that will shape user onboarding:\n\n### AI-Powered Personalization\nMachine learning will enable even more personalized onboarding experiences, adapting in real-time to user behavior and preferences.\n\n### Interactive Tutorials\nMove beyond static walkthroughs to interactive, hands-on learning experiences that adapt to user skill levels.\n\n### Community Integration\nConnecting new users with experienced community members during onboarding for peer-to-peer learning.\n\n### Cross-Platform Consistency\nAs users interact with platforms across multiple devices and contexts, maintaining consistent onboarding experiences becomes crucial.\n\n## Conclusion\n\nUser onboarding is both an art and a science. It requires empathy to understand user needs, creativity to design engaging experiences, and rigorous analysis to continuously improve. My experience at Bubble taught me that great onboarding isn't just about teaching users how to use your product—it's about helping them achieve their goals as quickly and confidently as possible.\n\nThe investment in excellent onboarding pays dividends in user retention, satisfaction, and ultimately, business success. Every minute spent improving the onboarding experience is a minute that will benefit thousands of future users.\n\nFor anyone working on user onboarding, remember that your users are real people with real goals and real frustrations. Design for their success, not just for your feature adoption metrics. The best onboarding experiences feel less like training and more like empowerment.",
        author: "Sam Morgan",
        tags: [
          "UX",
          "Onboarding",
          "Bubble",
          "Product Design",
          "User Experience",
        ],
        published: true,
        featured: false,
        readingTime: 7,
        publishedAt: now - 432000000, // 5 days ago
        createdAt: now - 432000000,
        updatedAt: now - 432000000,
      },
      {
        title: "Machine Learning in Music: Building Recommendation Systems",
        slug: "ml-music-recommendation-systems",
        excerpt:
          "How I built a machine learning-powered music recommendation system during my time at soiheardmusic, including technical challenges, solutions, and lessons learned.",
        content:
          "# Machine Learning in Music: Building Recommendation Systems\n\nDuring my decade running soiheardmusic, one of the most technically challenging and rewarding projects was building a machine learning-powered recommendation system. This system needed to understand musical preferences, discover patterns in listening behavior, and suggest new music that users would genuinely enjoy.\n\n## The Challenge\n\nMusic recommendation is uniquely complex because:\n- **Subjective taste**: What sounds good is highly personal\n- **Mood dependency**: The same person wants different music at different times\n- **Context matters**: Workout music differs from study music\n- **Discovery vs. familiarity**: Balancing new discoveries with known preferences\n- **Cold start problem**: How do you recommend music to new users?\n\n## Technical Approach\n\n### Data Collection\nWe collected multiple types of data to feed our recommendation engine:\n- User interactions (plays, skips, ratings)\n- Audio features (tempo, spectral features, MFCCs)\n- Contextual information (time of day, device, location)\n- Social signals (shares, playlist additions)\n\n### Audio Feature Extraction\nWe used librosa to extract musical features from audio files, including tempo, spectral centroid, zero crossing rate, and mel-frequency cepstral coefficients.\n\n### Hybrid Recommendation Approach\nWe implemented a hybrid system combining multiple techniques:\n\n#### 1. Collaborative Filtering\nUsed matrix factorization to identify patterns in user-item interactions.\n\n#### 2. Content-Based Filtering\nAnalyzed audio features to find similar tracks based on musical characteristics.\n\n#### 3. Context-Aware Recommendations\nTrained separate models for different contexts (workout, study, party, chill).\n\n## Advanced Features\n\n### Temporal Dynamics\nMusic preferences change over time, so we implemented temporal weighting to give more importance to recent interactions.\n\n### Diversity and Serendipity\nPure accuracy isn't enough—recommendations need diversity to keep users engaged and help them discover new music.\n\n### Handling the Cold Start Problem\nFor new users, we implemented a quick preference learning system where users rate a small set of diverse tracks.\n\n## Real-World Performance\n\n### Metrics We Tracked\n- **Precision@K**: Percentage of recommended tracks that users actually played\n- **Recall@K**: Percentage of tracks users liked that were recommended\n- **Diversity**: Average dissimilarity between recommended tracks\n- **Novelty**: How often we recommended tracks users hadn't heard before\n- **User Satisfaction**: Direct feedback and implicit satisfaction metrics\n\n### Results Achieved\n- **Precision@10**: 67% (compared to 23% for random recommendations)\n- **User Engagement**: 45% increase in average session time\n- **Discovery Rate**: 78% of users discovered new artists through recommendations\n- **Retention**: 32% improvement in month-over-month user retention\n\n## Technical Challenges and Solutions\n\n### 1. Scalability\n**Problem**: Processing millions of interactions in real-time\n**Solution**: Implemented batch processing for model training and Redis caching for real-time serving\n\n### 2. Sparsity\n**Problem**: Most users interact with only a small fraction of available tracks\n**Solution**: Used matrix factorization techniques and incorporated implicit feedback\n\n### 3. Bias Issues\n**Problem**: Popular tracks dominated recommendations\n**Solution**: Implemented popularity-based dampening and promotion of long-tail content\n\n### 4. Evaluation Challenges\n**Problem**: Offline metrics don't always correlate with user satisfaction\n**Solution**: Implemented A/B testing framework for online evaluation\n\n## Lessons Learned\n\n### 1. Data Quality Matters More Than Algorithms\nThe most sophisticated algorithm can't overcome poor data quality. We spent significant time on data cleaning and validation.\n\n### 2. User Feedback is Essential\nImplicit feedback (play duration, skips) was more valuable than explicit ratings for understanding true preferences.\n\n### 3. Context is King\nThe same user wants different music at different times. Context-aware recommendations significantly outperformed context-agnostic ones.\n\n### 4. Explanation Helps Adoption\nUsers were more likely to try recommended tracks when we explained why they were recommended.\n\n## Integration with Spotify API\n\nWe also integrated with Spotify's API to enhance our recommendations with their vast music catalog and audio features.\n\n## Future Improvements\n\n### Deep Learning Approaches\nWe were beginning to explore neural network approaches for more sophisticated pattern recognition.\n\n### Graph-Based Recommendations\nMusic relationships form complex networks that could be leveraged using graph neural networks.\n\n### Multi-Modal Learning\nCombining audio features with lyrics, social media sentiment, and visual elements from album artwork.\n\n## Impact on the Business\n\nThe recommendation system had measurable business impact:\n- **Increased User Engagement**: Users spent 45% more time on the platform\n- **Higher Conversion**: 28% increase in premium subscription conversions\n- **Artist Discovery**: Long-tail artists saw 60% more plays\n- **User Satisfaction**: NPS score increased from 32 to 67\n\n## Conclusion\n\nBuilding a music recommendation system taught me that machine learning is as much about understanding human behavior as it is about algorithms. The technical challenges were significant, but the real difficulty was translating complex musical preferences into mathematical models.\n\nThe intersection of music and technology continues to evolve, with new opportunities emerging in areas like AI-generated music, real-time collaboration, and immersive audio experiences. My experience with music recommendation systems provided a strong foundation for understanding how to build systems that understand and serve human preferences—skills that have proven invaluable in my current work with AI applications.\n\nFor anyone building recommendation systems, remember that the goal isn't just to predict what users will like—it's to help them discover something that will genuinely enrich their experience. The best recommendations feel like they came from a friend who knows your taste perfectly.",
        author: "Sam Morgan",
        tags: [
          "Machine Learning",
          "Music",
          "Recommendations",
          "Python",
          "Data Science",
        ],
        published: true,
        featured: false,
        readingTime: 9,
        publishedAt: now - 518400000, // 6 days ago
        createdAt: now - 518400000,
        updatedAt: now - 518400000,
      },
    ];

    // Insert blog posts
    for (const post of posts) {
      await ctx.db.insert("blogPosts", post);
    }

    return { success: true, postsCreated: posts.length };
  },
});

// Clear all data (for development/testing)
export const clearAllData = mutation({
  handler: async (ctx) => {
    // Clear portfolio projects
    const projects = await ctx.db.query("portfolioProjects").collect();
    for (const project of projects) {
      await ctx.db.delete(project._id);
    }

    // Clear blog posts
    const posts = await ctx.db.query("blogPosts").collect();
    for (const post of posts) {
      await ctx.db.delete(post._id);
    }

    return {
      success: true,
      projectsDeleted: projects.length,
      postsDeleted: posts.length,
    };
  },
});

// Seed variations data (v0 platform projects with demos)
export const seedVariations = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    const variations = [
      {
        prompt:
          "Create a modern landing page for a SaaS product with pricing tiers, testimonials, and a clean design using Tailwind CSS",
        demoUrl: "https://v0.dev/r/abc123",
        chatId: "chat_saas_landing",
        createdAt: now - 3600000, // 1 hour ago
        updatedAt: now - 3600000,
        status: "completed" as const,
      },
      {
        prompt:
          "Build a dashboard for an analytics platform with charts, user management, and a sidebar navigation",
        demoUrl: "https://v0.dev/r/def456",
        chatId: "chat_analytics_dashboard",
        createdAt: now - 7200000, // 2 hours ago
        updatedAt: now - 7200000,
        status: "completed" as const,
      },
      {
        prompt:
          "Design a blog homepage with featured posts, categories, and a search functionality",
        demoUrl: "https://v0.dev/r/ghi789",
        chatId: "chat_blog_homepage",
        createdAt: now - 14400000, // 4 hours ago
        updatedAt: now - 14400000,
        status: "completed" as const,
      },
      {
        prompt:
          "Create an e-commerce product page with image gallery, reviews, and add to cart functionality",
        demoUrl: "https://v0.dev/r/jkl012",
        chatId: "chat_ecommerce_product",
        createdAt: now - 86400000, // 1 day ago
        updatedAt: now - 86400000,
        status: "completed" as const,
      },
      {
        prompt:
          "Build a project management kanban board with drag and drop functionality",
        demoUrl: "https://v0.dev/r/mno345",
        chatId: "chat_kanban_board",
        createdAt: now - 172800000, // 2 days ago
        updatedAt: now - 172800000,
        status: "completed" as const,
      },
      {
        prompt:
          "Design a restaurant menu website with sections for different meal types and online ordering",
        demoUrl: "https://v0.dev/r/pqr678",
        chatId: "chat_restaurant_menu",
        createdAt: now - 259200000, // 3 days ago
        updatedAt: now - 259200000,
        status: "completed" as const,
      },
      {
        prompt:
          "Create a portfolio website for a photographer with image galleries and contact form",
        demoUrl: "https://v0.dev/r/stu901",
        chatId: "chat_photographer_portfolio",
        createdAt: now - 345600000, // 4 days ago
        updatedAt: now - 345600000,
        status: "completed" as const,
      },
      {
        prompt:
          "Build a real estate listing page with property details, image carousel, and mortgage calculator",
        demoUrl: "https://v0.dev/r/vwx234",
        chatId: "chat_real_estate_listing",
        createdAt: now - 432000000, // 5 days ago
        updatedAt: now - 432000000,
        status: "completed" as const,
      },
      {
        prompt:
          "Design a fitness tracking dashboard with workout logs, progress charts, and goal setting",
        demoUrl: "https://v0.dev/r/yza567",
        chatId: "chat_fitness_dashboard",
        createdAt: now - 518400000, // 6 days ago
        updatedAt: now - 518400000,
        status: "completed" as const,
      },
      {
        prompt:
          "Create a news website homepage with breaking news, categories, and trending stories",
        demoUrl: "https://v0.dev/r/bcd890",
        chatId: "chat_news_homepage",
        createdAt: now - 604800000, // 7 days ago
        updatedAt: now - 604800000,
        status: "completed" as const,
      },
    ];

    // Insert variations
    for (const variation of variations) {
      await ctx.db.insert("projects", variation);
    }

    return { success: true, variationsCreated: variations.length };
  },
});
