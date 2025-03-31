'use client'

import { useEffect, useState } from "react";
import { initializeScheduler } from "@/scripts/initScheduler";

export function SchedulerInit() {
  const [status, setStatus] = useState<string>('初始化中...');

  useEffect(() => {
    console.log('初始化定时任务..start.');
    async function init() {
      try {
        if (process.env.NODE_ENV === 'development') {
          const scheduler = await initializeScheduler();
          console.log('定时任务初始化完成:', scheduler);
          setStatus(scheduler ? '已启动' : '已禁用');
          return () => {
            console.log('定时任务已停止');
            scheduler?.stopAllJobs();
          };
        }
        setStatus('生产环境下禁用');
      } catch (error) {
        console.error('初始化定时任务失败:', error);
        setStatus('初始化失败');
      }
    }
    console.log('初始化定时任务...>>>');
    init();
  }, []);
  
  // 可以返回null或者一个状态指示器（仅在管理界面显示）
  return null;
}