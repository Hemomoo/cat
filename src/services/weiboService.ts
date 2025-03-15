import puppeteer from 'puppeteer';
import { saveContent } from './contentService';

export const getWeiboData = async (url: string) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      protocolTimeout: 120000
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // 访问微博页面
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 120000
    });

    // 等待内容加载
    await page.waitForSelector('.weibo-text', { timeout: 10000 });

    // 提取微博内容
    const posts = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.weibo-detail'));
      return items.map(item => ({
        content: item.querySelector('.weibo-text')?.textContent?.trim() || '',
        timestamp: item.querySelector('.time')?.textContent?.trim() || '',
        author: item.querySelector('.username')?.textContent?.trim() || ''
      }));
    });

    await browser.close();
    return posts;
  } catch (error) {
    console.error('微博数据抓取失败:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
};

// 保存微博内容到news类型
export const saveWeiboContent = async (posts: any[]) => {
  for (const post of posts) {
    const title = `微博动态 - ${post.author} - ${post.timestamp}`;
    const content = post.content;
    await saveContent('news', title, content);
  }
};