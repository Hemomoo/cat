'use server'

import { writeFile, mkdir, readdir, readFile, unlink } from 'fs/promises';
import path from 'path';

export async function saveAndMergeBilibiliData(newData: any) {
  const contentDir = path.join(process.cwd(), 'content', 'bilibili');
  
  // 确保目录存在
  await mkdir(contentDir, { recursive: true });
  
  // 合并现有数据
  let mergedData = { ...newData };
  try {
    const files = await readdir(contentDir);
    
    // 只读取index.json文件，避免处理多个文件
    const indexPath = path.join(contentDir, 'index.json');
    if (files.includes('index.json')) {
      const fileContent = await readFile(indexPath, 'utf-8');
      const fileData = JSON.parse(fileContent);
      
      if (fileData.videoList && mergedData.videoList) {
        // 使用Map进行更高效的去重
        const videoMap = new Map();
        
        // 先添加现有数据
        fileData.videoList.forEach((item: any) => {
          const key = item.url.split('?')[0]; // 移除URL参数以更好地去重
          videoMap.set(key, item);
        });
        
        // 用新数据覆盖或添加
        mergedData.videoList.forEach((item: any) => {
          const key = item.url.split('?')[0];
          videoMap.set(key, item);
        });
        
        // 转回数组
        mergedData.videoList = Array.from(videoMap.values());
      }
    }
  } catch (error) {
    console.error('读取或合并现有数据失败:', error);
  }
  
  // 将合并后的数据写入 index.json 文件
  const filePath = path.join(contentDir, 'index.json');
  await writeFile(filePath, JSON.stringify(mergedData, null, 2), 'utf-8');
  
  return {
    ...mergedData,
    saved: true,
    filePath: '/content/bilibili/index.json'
  };
}