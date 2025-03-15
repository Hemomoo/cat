'use client'

import { useEffect, useState } from "react";
import { initializeScheduler } from "@/scripts/initScheduler";

export function SchedulerInit() {
  const [status, setStatus] = useState<string>('初始化中...');

  useEffect(() => {
    async function init() {
      try {
        if (process.env.NODE_ENV === 'production') {
          const scheduler = await initializeScheduler();
          setStatus(scheduler ? '已启动' : '已禁用');
          
          return () => {
            scheduler?.stopAllJobs();
          };
        } else {
          setStatus('开发环境下禁用');
        }
      } catch (error) {
        console.error('初始化定时任务失败:', error);
        setStatus('初始化失败');
      }
    }
    
    init();
  }, []);
  
  // 可以返回null或者一个状态指示器（仅在管理界面显示）
  return null;
}