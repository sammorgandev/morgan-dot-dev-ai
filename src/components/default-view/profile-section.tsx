import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Instagram, XSquareIcon } from "lucide-react";
import Image from "next/image";

export function ProfileSection() {
  return (
    <div className="text-center space-y-4">
      <div className="space-y-2 flex flex-col items-start">
        <div className="rounded-full overflow-hidden w-fit">
          <Image
            src="/pic.jpg"
            alt="Sam Morgan"
            width={50}
            height={50}
            className="rounded-full object-cover aspect-square"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Sam Morgan</h1>
        <p className="text-xl text-muted-foreground">Software Engineer</p>
      </div>

      <div className="text-lg text-muted-foreground flex flex-col gap-2 text-left items-start justify-start">
        <div>
          Currently working on AI{" "}
          <a
            href="https://bubble.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            <span className="hover:scale-105 transition-all">@Bubble</span>
          </a>
        </div>
        <div>
          Previously worked on operations{" "}
          <a
            href="https://soiheardmusic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            @soiheardmusic
          </a>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex items-start justify-start space-x-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/sammorgan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://linkedin.com/in/sammorgan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://instagram.com/sammorgan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="h-4 w-4" />
            <span className="sr-only">Instagram</span>
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://x.com/sammorgan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XSquareIcon className="h-4 w-4" />
            <span className="sr-only">X</span>
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="mailto:sam@sammorgan.dev">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Email</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
