"use client";

import MarkdownEditor from "@/components/Editor/MarkdownEditor";
import { saveContent } from "@/services/contentService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner"

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;

  const handleSave = async (title: string, content: string) => {
    try {
      const result = await saveContent(
        type as "tours" | "news",
        title,
        content
      );
      
      if (result.success) {
        toast.success("内容已成功保存");
        router.push("/admin");
      } else {
        toast.error("保存失败，请重试");
      }
    } catch (error) {
      console.error("保存失败:", error);
      toast.error("保存失败，请重试");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回管理页面
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        {type === "tours" ? "编辑巡演信息" : "编辑新闻动态"}
      </h1>

      <MarkdownEditor
        type={type as "tour" | "news"}
        onSave={handleSave}
      />
    </div>
  );
}