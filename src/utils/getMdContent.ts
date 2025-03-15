import fs from 'fs/promises';
import path from 'path';

export async function getMdContent(folder: 'tours' | 'news') {
  const contentDir = path.join(process.cwd(), 'content', folder);
  
  try {
    const files = await fs.readdir(contentDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const contents = await Promise.all(
      mdFiles.map(async (file) => {
        const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
        return {
          id: file.replace('.md', ''),
          content,
          date: new Date(parseInt(file.split('-').pop()!)).toISOString(),
        };
      })
    );
    
    return contents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('读取文件失败:', error);
    return [];
  }
}

export async function getMdContentById(folder: 'tours' | 'news', id: string) {
  const contents = await getMdContent(folder);
  return contents.find(content => content.id === id);
}