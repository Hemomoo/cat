
"use server"
import schedule from 'node-schedule';
import { getBilibiliAudioData } from '@/services/contentService';
import { saveAndMergeBilibiliData } from '@/app/actions/bilibili';
// 移除了微博相关的导入
import { getPythonkeConcerts } from '@/services/pythonkeService';

const jobs = new Map<string, schedule.Job>();

export async function initializeJobs() {
  try {
    // 初始化B站数据获取任务
    await startBilibiliJob();
    // 移除了微博数据获取任务的初始化
    // 初始化演出信息获取任务
    await startConcertJob();
    console.log('所有定时任务已初始化');
  } catch (error) {
    console.error('初始化任务失败:', error);
  }
}

async function startBilibiliJob() {
  try {
    // 立即执行一次
    await fetchBilibiliData();

    // 设置定时任务 - 每天凌晨2点执行
    const job = schedule.scheduleJob('0 2 * * *', () => fetchBilibiliData());
    jobs.set('bilibili', job);
    console.log('B站数据同步任务已设置');
  } catch (error) {
    console.error('设置B站数据同步任务失败:', error);
  }
}

export async function fetchBilibiliData() {
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


async function startConcertJob() {
  try {
    // 立即执行一次
    await fetchConcertData();

    // 设置定时任务 - 每天凌晨3点执行
    const job = schedule.scheduleJob('0 3 * * *', () => fetchConcertData());
    jobs.set('concert', job);
    console.log('演出信息同步任务已设置');
  } catch (error) {
    console.error('设置演出信息同步任务失败:', error);
  }
}

export async function fetchConcertData() {
  try {
    console.log('获取演出信息');
    await getPythonkeConcerts();
    console.log('演出信息获取并保存成功');
    return true;
  } catch (error) {
    console.error('演出信息获取或保存失败:', error);
    return false;
  }
}

export async function stopAllJobs() {
  jobs.forEach(job => job.cancel());
  jobs.clear();
  console.log('所有定时任务已停止>>>>>');
}
