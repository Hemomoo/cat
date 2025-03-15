import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function cleanBilibiliData() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'bilibili', 'index.json');
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    if (data.videoList && Array.isArray(data.videoList)) {
      // 使用Map进行高效去重
      const videoMap = new Map();
      
      data.videoList.forEach((item: any) => {
        // 移除URL中的查询参数
        const baseUrl = item.url.split('?')[0];
        // 保留最简单的URL版本
        if (!videoMap.has(baseUrl) || item.url.length < videoMap.get(baseUrl).url.length) {
          videoMap.set(baseUrl, {
            id: item.id,
            name: item.name,
            url: baseUrl
          });
        }
      });
      
      // 转回数组并按ID排序
      data.videoList = Array.from(videoMap.values())
        .sort((a, b) => a.id - b.id);
      
      // 写回文件
      await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`成功清理数据，保留了 ${data.videoList.length} 条唯一记录`);
    }
  } catch (error) {
    console.error('清理数据失败:', error);
  }
}

cleanBilibiliData();