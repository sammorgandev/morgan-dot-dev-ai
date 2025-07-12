import { Card } from "@/components/ui/card";
import { getBlogPosts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star } from "lucide-react";
import Link from "next/link";
import { formatDate } from "./utils";

export default async function AllPosts() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">All Posts</h2>
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <Card
            key={post._id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min read
                  </span>
                  {post.featured && (
                    <span className="flex items-center gap-1 text-primary">
                      <Star className="h-3 w-3 fill-primary" />
                      Featured
                    </span>
                  )}
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer mb-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground text-sm mb-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="shrink-0" asChild>
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
