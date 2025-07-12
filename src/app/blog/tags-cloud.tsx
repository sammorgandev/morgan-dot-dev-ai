import { Card } from "@/components/ui/card";
import { getBlogTags } from "@/lib/data";

export default async function TagsCloud() {
  const uniqueTags = await getBlogTags();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Topics</h2>
      <Card className="p-6">
        <div className="flex flex-wrap gap-2">
          {uniqueTags.map((tag, index) => (
            <button
              key={index}
              className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
