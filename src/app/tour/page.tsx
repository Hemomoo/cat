import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getMdContent } from "@/utils/getMdContent";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import tours from '../../../content/tours/index.json'

interface TourDate {
  id: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  status: "upcoming" | "sold_out" | "available";
  price: {
    min: number;
    max: number;
  };
}

// 修改接口定义以匹配 JSON 数据结构
interface TourInfo {
  title: string;
  time: string;
  venue: string;
  price: string;
}

export default async function TourPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 5;
  const totalPages = Math.ceil(tours.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentTours = tours.slice(start, end);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">巡演信息</h1>

      {/* 巡演介绍 */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">2024春季巡演</h2>
          <p className="text-lg mb-6">房东的猫2024春季巡演即将开启，带着新专辑《这是你想要的生活吗》中的歌曲与大家相见。</p>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-2">10+</p>
              <p className="text-sm">演出城市</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-2">15+</p>
              <p className="text-sm">演出场次</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-2">100k+</p>
              <p className="text-sm">预计观众</p>
            </div>
          </div>
        </div>
      </section>

      {/* 巡演日程 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">演出日程</h2>
        </div>
        
        <div className="space-y-6">
          {currentTours.map((tour, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer mb-3">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{tour.title}</h3>
                    <div className="space-y-1 text-gray-600">
                      <p className="flex items-center gap-2">
                        <span className="inline-block w-20 font-medium">演出时间：</span>
                        {tour.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="inline-block w-20 font-medium">演出场地：</span>
                        {tour.venue}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="inline-block w-20 font-medium">票价：</span>
                        {tour.price}
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    购票
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={`/tour?page=${page - 1}`} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/tour?page=${pageNumber}`}
                      isActive={pageNumber === page}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/tour?page=${page + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

      {/* 购票须知 */}
      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>购票须知</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">购票方式</h4>
              <p className="text-gray-600">1. 在线购票：通过官方售票平台进行在线购票</p>
              <p className="text-gray-600">2. 电话购票：拨打售票热线 400-XXX-XXXX</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">注意事项</h4>
              <p className="text-gray-600">1. 每笔订单最多购买4张门票</p>
              <p className="text-gray-600">2. 购票成功后不支持退换</p>
              <p className="text-gray-600">3. 演出当天请携带有效身份证件入场</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">防疫要求</h4>
              <p className="text-gray-600">请遵守演出场地的相关防疫要求，具体以现场通知为准</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}