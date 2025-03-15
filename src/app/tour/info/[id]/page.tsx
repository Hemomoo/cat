import { getMdContentById } from "@/utils/getMdContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

export default async function TourDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getMdContentById("tours", params.id);

  if (!tour) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/tour">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">巡演详情</h1>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{tour.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">购票信息</h3>
            <div className="space-y-4">
              <p className="text-gray-600">创建时间：{new Date(tour.date).toLocaleString('zh-CN')}</p>
              <div className="flex gap-4">
                <Button>立即购票</Button>
                <Button variant="outline">分享</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}