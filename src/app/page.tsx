import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="relative z-20 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">房东的猫</h1>
          <p className="text-xl mb-8">用音乐诉说生活的故事</p>
          <a href="/music" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
            聆听音乐
          </a>
        </div>
      </section>

      {/* Latest Release */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">最新音乐</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="aspect-square relative">
                <Image
                  src="/album-cover-1.jpg"
                  alt="专辑封面"
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>这是你想要的生活吗</CardTitle>
              <CardDescription>2023 全新专辑</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tour Dates */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">巡演日程</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>2024春季巡演 - 北京站</CardTitle>
                  <CardDescription>北京 展览馆剧场</CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-bold">2024.04.15</p>
                  <a href="/tour" className="text-blue-600 hover:underline">购票详情</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 rounded-2xl p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">关于我们</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            房东的猫是一支成立于2014年的民谣组合，由主唱王心怡和吉他手吴佩岭组成。
            我们用温暖的音乐记录生活中的每个瞬间，传递对生活的热爱与感动。
          </p>
          <a href="/news" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            了解更多
          </a>
        </div>
      </section>
    </div>
  );
}
