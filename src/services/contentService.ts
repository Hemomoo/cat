import schedule from 'node-schedule';
import puppeteer from 'puppeteer';

export const getBilibiliAudioData = async (url: string) => {
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
    let cookie = "buvid3=6742AF73-53C2-22F6-8DFD-9C1DD09A94CB63531infoc; b_nut=1741875263; _uuid=871D2868-A89B-E667-D101010-1D24DA38378E64613infoc; header_theme_version=CLOSE; enable_web_push=DISABLE; enable_feed_channel=ENABLE; buvid_fp=b05728e8d5a716cde0e87e9138fe6ff6; buvid4=CFA682A1-4DD4-E371-5550-5AD07981929156127-025022009-z1acSDT+l3vHwSTXfwrpyw%3D%3D; SESSDATA=48c2e47d%2C1757427297%2C1a9e9%2A32CjD3v2qviiu0IiO4jmuL_R4o3EtOWIP1yiJrD4dTgmSzmbb8J_WxAUzwxaFPJ5sBWIcSVnJRX0xfYkJvZlBMRW9hMU1ibXZBOW9IMUhzYzVTb0R5WEdmRVllNldnNXlIakZwUGVpYlhxVHhSMm45M0laWC1EME5TZEFXY2RjQVZUeEQtOUp4cmN3IIEC; bili_jct=bc4f4c741b8a6f4d83c8d17a65fe38f6; DedeUserID=8627566; DedeUserID__ckMd5=14deb14efbc36a18; sid=6pnmzsmr; rpdid=|(RlY|uR|u~0J'u~Ru)~lJkk; bp_t_offset_8627566=1043847425690697728; CURRENT_FNVAL=4048; b_lsid=591D16C3_19593454768; home_feed_column=4; browser_resolution=1060-2297; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIxOTE4MDUsImlhdCI6MTc0MTkzMjU0NSwicGx0IjotMX0.PHojCM14Ww1VXb-fC6xEdvWXgYWzDSFWUhy0xmEW0Ak; bili_ticket_expires=1742191745"

    const cookies = cookie.split('; ').map(pair => {
      const [name, value] = pair.split('=');
      return {name, value, domain: '.bilibili.com'};
    });
    
    // 设置cookie
    await page.setCookie(...cookies);
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // 访问页面
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 120000
    });

    // 判断是否是合集,如果是合集返回用户选择,如果是单集直接下载
    const isMultiPart = await page.evaluate(() => {
      return document.querySelector('.video-pod__body') !== null;
    });

    if (isMultiPart) {
      const videoList = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('.video-pod__body .video-pod__list .video-pod__item'));
          return items.map((item, index) => {
              //判断两种视频合集
              const dataKey = item.getAttribute('data-key') as string;
              let videoUrl;
              if (/^\d+$/.test(dataKey)) { // 如果data-key是纯数字
                  videoUrl = `${window.location.href}?p=${index + 1}`;
              } else if (/^BV[a-zA-Z0-9]{10}$/.test(dataKey)) { // 如果data-key是BV号
                  videoUrl = `https://www.bilibili.com/video/${dataKey}`;
              } else { // 其他情况，例如番剧，纪录片等， data-key是ep+数字, av号等
                  // 获取视频链接, 需要根据实际情况修改选择器
                  const linkElement = item.querySelector('a.video-episode-card__mask'); // 例如番剧
                  if (linkElement) {
                      videoUrl = new URL((linkElement as any).href).href; // 获取完整链接
                  } else {
                      console.error(`无法处理data-key: ${dataKey}`);
                      videoUrl = null; // 或其他默认值
                  }
              }
              return {
                  id: index + 1,
                  name: item.querySelector('.title .title-txt')?.textContent?.trim() || `视频 ${index + 1}`,
                  url: videoUrl
              };
          }).filter(item => item.url !== null); // 过滤掉url为null的项;
      });
      await browser.close();
      
      let userSet;
      for (let i = 0; i < videoList.length; i++) {
          if (videoList[i]?.url?.split('?')[0] === url) {
              userSet = videoList[i];
              break;
          }
      }
      
      return {isMultiPart: true, videoList, userSet};
    } else {
      // 获取视频标题
      const title = await page.title();
      const cleanedTitle = title.replace(/_哔哩哔哩_bilibili/g, '').trim();
      
      await browser.close();
      return {
          isMultiPart: false,
          videoList: [{id: 1, name: cleanedTitle, url: url}],
      };
    }
  } catch (error) {
    console.error(error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
};

export const saveContent = async (
  type: "tours" | "news",
  title: string,
  content: string
) => {
  try {
    const response = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        title,
        content
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API 请求失败:", error);
    return { success: false, error };
  }
};

// 添加定时任务
// 替换 node-cron 为 node-schedule
// export const scheduleMonthlyCheck = async () => {
//   const job = schedule.scheduleJob('0 2 1 * *', async () => {
//     // 你现有的定时任务逻辑
//   });
// };