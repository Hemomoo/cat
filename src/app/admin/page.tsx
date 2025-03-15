import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FileEdit, Music, ArrowLeft, List } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">内容管理</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              巡演管理
            </CardTitle>
            <CardDescription>管理巡演信息、时间、地点等内容</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/content/tours">
              <Button className="w-full">
                <FileEdit className="mr-2 h-4 w-4" />
                新增巡演信息
              </Button>
            </Link>
            <Link href="/admin/tours">
              <Button variant="outline" className="w-full">
                <List className="mr-2 h-4 w-4" />
                查看巡演列表
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="h-5 w-5" />
              新闻管理
            </CardTitle>
            <CardDescription>管理新闻动态、公告等内容</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/content/news">
              <Button className="w-full">
                <FileEdit className="mr-2 h-4 w-4" />
                编辑新闻动态
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}