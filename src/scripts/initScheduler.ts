"use server"
import { initializeJobs, stopAllJobs } from '@/app/actions/schedulerService';

export async function initializeScheduler() {
 
  if (process.env.ENABLE_SCHEDULER === 'true') {
    console.log('正在启动定时任务服务...');
    await initializeJobs();
    console.log('定时任务服务已启动');
    return { stopAllJobs };
  }
  
  // 确保清理任何可能存在的定时任务
  console.log('正在初始化定时任务服务...',process.env.ENABLE_SCHEDULER );
  await stopAllJobs();
  console.log('定时任务服务已禁用');
  return null;
}