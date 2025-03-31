import { Card, CardContent } from "@/components/ui/card";
import { getMdContent } from "@/utils/getMdContent";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 6;
  const news = await getMdContent('news');
  const totalPages = Math.ceil(news.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentNews = news.slice(start, end);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">新闻动态</h1>

      {/* 置顶新闻 */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">最新动态</h2>
          <p className="text-lg mb-6">关注房东的猫的最新动态，了解更多音乐创作背后的故事。</p>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-2">100+</p>
              <p className="text-sm">新闻报道</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-2">50+</p>
              <p className="text-sm">媒体采访</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-2">20+</p>
              <p className="text-sm">音乐故事</p>
            </div>
          </div>
        </div>
      </section>

      {/* 新闻列表 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">全部新闻</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {currentNews.map((news) => (
            <Link href={`/news/info/${news.id}`} key={news.id}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown>{news.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/news?page=${page - 1}`} />
                </PaginationItem>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={`/news?page=${pageNumber}`}
                    isActive={pageNumber === page}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`/news?page=${page + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </div>
  );
}