import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, Download, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header Card */}
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/pic.jpg"
              alt="Sam Morgan"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              width={128}
              height={128}
            />
            <div>
              <h1 className="text-4xl font-bold">Sam Morgan</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Software Engineer
              </p>
              <p className="text-lg text-primary mt-1">AI Team @ Bubble</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:sam@sammorgan.dev"
                  className="hover:text-primary transition-colors"
                >
                  sam@sammorgan.dev
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4" />
                <a
                  href="https://github.com/sammorgan"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Linkedin className="h-4 w-4" />
                <a
                  href="https://linkedin.com/in/sammorgan"
                  className="hover:text-primary transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <Button className="mt-4">
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Professional Summary</h2>
          <p className="text-muted-foreground leading-relaxed">
            Experienced software engineer with a unique background spanning
            music, no-code development, and AI technologies. Currently working
            on AI initiatives at Bubble, with extensive experience in user
            onboarding flows, account management systems, and technical product
            support. Passionate about creating intuitive user experiences and
            leveraging AI to solve complex problems.
          </p>
        </Card>

        {/* Experience */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Experience</h2>

          {/* Bubble AI Engineer */}
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    Software Engineer, AI Team
                  </h3>
                  <p className="text-primary font-medium">Bubble</p>
                  <p className="text-sm text-muted-foreground">
                    2025 - Present
                  </p>
                </div>
                <a
                  href="https://bubble.io"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-muted-foreground mt-2">
                Working on AI initiatives and features to enhance the no-code
                platform experience.
              </p>
            </div>

            {/* Bubble Product Team */}
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">
                  Internal Bubble Developer
                </h3>
                <p className="text-primary font-medium">Bubble</p>
                <p className="text-sm text-muted-foreground">2022 - 2025</p>
              </div>
              <p className="text-muted-foreground mt-2">
                Developed user onboarding flows, account settings screens, and
                app management interfaces. Focused on improving user experience
                and platform usability.
              </p>
            </div>

            {/* Bubble Success Team */}
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">
                  Technical Product Support Specialist
                </h3>
                <p className="text-primary font-medium">Bubble</p>
                <p className="text-sm text-muted-foreground">2021 - 2022</p>
              </div>
              <p className="text-muted-foreground mt-2">
                Provided technical support to users, troubleshot complex issues,
                and helped optimize app performance.
              </p>
            </div>

            {/* Science4Data */}
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-muted rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">
                  Content Generation Developer
                </h3>
                <p className="text-primary font-medium">Science4Data</p>
                <p className="text-sm text-muted-foreground">
                  2023 - Present (Contract)
                </p>
              </div>
              <p className="text-muted-foreground mt-2">
                Built content generation applications and developed report
                analysis systems using SEC data APIs for financial companies.
                Focused on automated data processing and insights generation.
              </p>
            </div>

            {/* No-Code Coaching */}
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-muted rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">No-Code App Coach</h3>
                <p className="text-primary font-medium">Freelance</p>
                <p className="text-sm text-muted-foreground">2020 - 2021</p>
              </div>
              <p className="text-muted-foreground mt-2">
                Coached individuals and small businesses in building no-code
                applications, helping them bring their ideas to life without
                traditional programming.
              </p>
            </div>

            {/* soiheardmusic */}
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-muted rounded-full"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">Founder & Operator</h3>
                  <p className="text-primary font-medium">soiheardmusic</p>
                  <p className="text-sm text-muted-foreground">2012 - 2022</p>
                </div>
                <a
                  href="https://soiheardmusic.com"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-muted-foreground mt-2">
                Founded and operated a music-focused business for 10 years,
                developing strong entrepreneurial skills and deep understanding
                of digital content creation and distribution.
              </p>
            </div>
          </div>
        </Card>

        {/* Education */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Education</h2>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">
                Berklee College of Music
              </h3>
              <p className="text-muted-foreground">Bachelor&apos;s Degree</p>
              <p className="text-sm text-muted-foreground">2007 - 2011</p>
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Programming Languages</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  JavaScript
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Python
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  SQL
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Next.js
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Node.js
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Bubble
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI & Data</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Machine Learning
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  SEC Data APIs
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Content Generation
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Other</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  No-Code Development
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Product Support
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  User Experience
                </span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
