import { schedulerService } from '@/app/actions/schedulerService';

export async function initializeScheduler() {
  if (process.env.ENABLE_SCHEDULER === 'true') {
    console.log('正在启动定时任务服务...');
    await schedulerService.initializeJobs();
    console.log('定时任务服务已启动');
    return schedulerService;
  }
  
  // 确保清理任何可能存在的定时任务
  schedulerService.stopAllJobs();
  console.log('定时任务服务已禁用');
  return null;
}