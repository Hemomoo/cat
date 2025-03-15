import { getMdContentById } from "@/utils/getMdContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const news = await getMdContentById("news", params.id);

  if (!news) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/news">
          <Button variant="ghost" className="pl-0 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
            <span className="group-hover:underline">返回新闻列表</span>
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <Calendar className="h-4 w-4" />
              <time>{new Date(news.date).toLocaleDateString('zh-CN')}</time>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{news.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            分享
          </Button>
        </div>
      </div>
    </div>
  );
}