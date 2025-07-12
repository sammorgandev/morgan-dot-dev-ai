import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "./utils";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data";

export default async function RecentPosts() {
  const blogPosts = await getBlogPosts();
  const recentPosts = blogPosts.filter((post) => !post.featured).slice(0, 4);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recentPosts.map((post) => (
          <Card
            key={post._id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min
                </span>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                    +{post.tags.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
