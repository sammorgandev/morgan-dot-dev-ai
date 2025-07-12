import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBlogPosts } from "@/lib/data";
import {
  Link,
  Calendar,
  Clock,
  Star,
  User,
  Tag,
  ArrowRight,
} from "lucide-react";

export default async function FeaturedPosts() {
  const blogPosts = await getBlogPosts();
  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Star className="h-6 w-6 text-primary" />
        Featured Posts
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredPosts.map((post) => (
          <Card
            key={post._id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min read
                </div>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h3>
              </Link>

              <p className="text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <Button variant="outline" className="mt-4 group" asChild>
                <Link href={`/blog/${post.slug}`}>
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
