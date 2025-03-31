import cron from 'node-cron';
import { getWeiboData, saveWeiboContent } from './weiboService';
import { getPythonkeConcerts } from './pythonkeService';

// 定义不同类型的定时任务
export const startContentUpdateTimer = () => {
  return cron.schedule('0 0 * * *', () => { // 每天零点执行
    console.log('执行内容更新任务');
    // 内容更新逻辑
  });
};

export const startBilibiliSyncTimer = () => {
  return cron.schedule('0 */12 * * *', () => { // 每12小时执行一次
    console.log('执行B站同步任务');
    // B站同步逻辑
  });
};

export const startWeiboSyncTimer = () => {
  return cron.schedule('0 */2 * * *', async () => { // 每2小时执行一次
    console.log('执行微博同步任务');
    try {
      const weiboUrl = 'https://weibo.com/u/your_weibo_id'; // 替换为目标微博页面URL
      const posts = await getWeiboData(weiboUrl);
      await saveWeiboContent(posts);
      console.log('微博同步完成');
    } catch (error) {
      console.error('微博同步失败:', error);
    }
  });
};

// 启动所有定时任务的函数
export const startConcertSyncTimer = () => {
  return cron.schedule('0 0 * * *', async () => { // 每天凌晨执行
    console.log('执行演出信息同步任务');
    try {
      await getPythonkeConcerts();
      console.log('演出信息同步完成');
    } catch (error) {
      console.error('演出信息同步失败:', error);
    }
  });
};

export const startAllTimers = () => {
  const contentTimer = startContentUpdateTimer();
  const bilibiliTimer = startBilibiliSyncTimer();
  const weiboTimer = startWeiboSyncTimer();
  const concertTimer = startConcertSyncTimer();
  
  // 立即执行一次演出信息同步
  getPythonkeConcerts().catch(error => {
    console.error('初始演出信息同步失败:', error);
  });
  
  return {
    contentTimer,
    bilibiliTimer,
    weiboTimer,
    stopAll: () => {
      contentTimer.stop();
      bilibiliTimer.stop();
      weiboTimer.stop();
      concertTimer.stop();
    }
  };
};