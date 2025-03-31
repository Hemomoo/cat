"use server"
import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs";
import path from "path";



// 完善演出信息接口
interface ConcertInfo {
  title: string;
  time: string;
  venue: string;
  price: string;
  image?: string;
}

// 浏览器配置
const getPuppeteerConfig = (): any => ({
  executablePath: process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : puppeteer.executablePath(),
  launchOptions: {
    headless: false,
    defaultViewport: null,
    channel: "chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--start-maximized",
      "--disable-notifications",
      "--disable-extensions",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    userDataDir: "./chrome-data",
    timeout: 60000,
    protocolTimeout: 60000,
  }
});

// 读取现有演出信息
const readExistingConcerts = async (filePath: string): Promise<ConcertInfo[]> => {
  try {
    if (fs.existsSync(filePath)) {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('读取现有演出信息失败:', error);
  }
  return [];
};

// 检查演出是否重复
const isNewConcert = (concert: ConcertInfo, existingConcerts: ConcertInfo[]): boolean => {
  return !existingConcerts.some(existing => 
    existing.title === concert.title && 
    existing.time === concert.time && 
    existing.venue === concert.venue
  );
};

// 保存演出信息到文件
const saveConcertsToFile = async (concerts: ConcertInfo[]): Promise<void> => {
  const tourDir = path.join(process.cwd(), "content", "tours");
  const filePath = path.join(tourDir, `index.json`);
  
  // 创建目录（如果不存在）
  if (!fs.existsSync(tourDir)) {
    fs.mkdirSync(tourDir, { recursive: true });
  }

  // 读取现有数据
  const existingConcerts = await readExistingConcerts(filePath);
  
  // 过滤出新的演出信息
  const newConcerts = concerts.filter(concert => isNewConcert(concert, existingConcerts));
  
  if (newConcerts.length > 0) {
    // 合并新旧数据并按时间排序
    const allConcerts = [...existingConcerts, ...newConcerts].sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB;
    });

    // 保存更新后的数据
    const jsonContent = JSON.stringify(allConcerts, null, 2);
    await fs.promises.writeFile(filePath, jsonContent, "utf-8");
    console.log(`已添加 ${newConcerts.length} 场新演出信息到: ${filePath}`);
  } else {
    console.log('没有发现新的演出信息');
  }
};

// 提取演出信息
const extractConcertInfo = async (page: Page): Promise<ConcertInfo[]> => {
  return page.evaluate(() => {
    const concerts: ConcertInfo[] = [];
    document.querySelectorAll(".event_box").forEach((box) => {
      try {
        const title = box.querySelector(".tra-head h3")?.textContent?.trim();
        // 修改获取时间的方式
        const timeElement = box.querySelector(".bi-alarm")?.parentElement;
        const time = Array.from(timeElement?.childNodes || [])
          .find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.includes(':'))
          ?.textContent?.trim();
        const venue = box.querySelector(".venue")?.textContent
          ?.split("\n")[1]?.trim();
        const price = box.querySelector(".price")?.textContent?.trim();

        if (title && time && venue && price) {
          concerts.push({
            title,
            time,
            venue,
            price: `${price}元起`,
          });
        }
      } catch (error) {
        console.error("提取单个演出信息时出错:", error);
      }
    });
    return concerts;
  });
};

// 主函数
export async function getPythonkeConcerts(): Promise<ConcertInfo[]> {
  let browser: Browser | null = null;
  
  try {
    console.log("正在启动浏览器...");
    const config = getPuppeteerConfig();
    browser = await puppeteer.launch({
      ...config.launchOptions,
      executablePath: config.executablePath,
    });

    const page = await browser.newPage();
    
    // 设置页面超时
    page.setDefaultTimeout(60000);
    
    // 导航到搜索页面
    await page.goto("https://www.pythonke.com/topic/search/", {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });

    // 等待页面加载完成
    await page.waitForNetworkIdle({ idleTime: 2000 });

    // 执行搜索
    await page.waitForSelector(".search-form");
    await page.type("input.search-input", "房东的猫");
    await page.click(".search-button");

    // 等待搜索结果
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    // 提取演出信息
    const concerts = await extractConcertInfo(page);
    console.log(`成功获取 ${concerts.length} 场演出信息`);

    // 保存数据
    await saveConcertsToFile(concerts);

    return concerts;
  } catch (error) {
    console.error("获取演出信息失败:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log("浏览器已关闭");
    }
  }
}
