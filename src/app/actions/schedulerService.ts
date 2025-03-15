
"use server"
import schedule from 'node-schedule';
import { getBilibiliAudioData } from '@/services/contentService';
import { saveAndMergeBilibiliData } from '@/app/actions/bilibili';
import { getWeiboData, saveWeiboContent } from '@/services/weiboService';

class SchedulerService {
  private jobs: Map<string, schedule.Job> = new Map();

  constructor() {
    console.log('初始化任务服务');
  }

  public async initializeJobs() {
    // 初始化B站数据获取任务
    await this.startBilibiliJob();
    // 初始化微博数据获取任务
    await this.startWeiboJob();
    console.log('所有定时任务已初始化');
  }

  private async startBilibiliJob() {
    try {
      // 立即执行一次
      await this.fetchBilibiliData();

      // 设置定时任务 - 每天凌晨2点执行
      const job = schedule.scheduleJob('0 2 * * *', () => this.fetchBilibiliData());
      this.jobs.set('bilibili', job);
      console.log('B站数据同步任务已设置');
    } catch (error) {
      console.error('设置B站数据同步任务失败:', error);
    }
  }

  public async fetchBilibiliData() {
    try {
      console.log('获取B站数据');
      const data = await getBilibiliAudioData('https://www.bilibili.com/video/BV1oV411c7uw');
      await saveAndMergeBilibiliData(data);
      console.log('B站数据获取并保存成功');
      return true;
    } catch (error) {
      console.error('B站数据获取或保存失败:', error);
      return false;
    }
  }

  private async startWeiboJob() {
    try {
      // 立即执行一次
      await this.fetchWeiboData();

      // 设置定时任务 - 每2小时执行一次
      const job = schedule.scheduleJob('0 */2 * * *', () => this.fetchWeiboData());
      this.jobs.set('weibo', job);
      console.log('微博数据同步任务已设置');
    } catch (error) {
      console.error('设置微博数据同步任务失败:', error);
    }
  }

  public async fetchWeiboData() {
    try {
      console.log('获取微博数据');
      const weiboUrl = 'https://weibo.com/p/1004063908615569/home'; // 替换为目标微博页面URL
      const posts = await getWeiboData(weiboUrl);
      await saveWeiboContent(posts);
      console.log('微博数据获取并保存成功');
      return true;
    } catch (error) {
      console.error('微博数据获取或保存失败:', error);
      return false;
    }
  }

  public stopAllJobs() {
    this.jobs.forEach(job => job.cancel());
    this.jobs.clear();
    console.log('所有定时任务已停止');

  }
}

export const schedulerService = new SchedulerService();
