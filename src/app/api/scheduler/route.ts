import { NextResponse } from 'next/server';
import schedule from 'node-schedule';

// 保存定时任务引用
let scheduledJob: schedule.Job | null = null;

export async function POST(request: Request) {
  try {
    const { cronExpression, taskType } = await request.json();
    
    if (scheduledJob) {
      scheduledJob.cancel();
    }

    scheduledJob = schedule.scheduleJob(cronExpression, async () => {
      console.log(`执行定时任务: ${taskType}`);
      // 根据任务类型执行不同的操作
      switch (taskType) {
        case 'bilibili':
          // 执行B站相关任务
          break;
        case 'content':
          // 执行内容更新任务
          break;
        default:
          console.log('未知任务类型');
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `定时任务已设置: ${cronExpression}` 
    });
  } catch (error) {
    console.error('设置定时任务失败:', error);
    return NextResponse.json(
      { success: false, error: '设置定时任务失败' }, 
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    if (scheduledJob) {
      scheduledJob.cancel();
      scheduledJob = null;
    }
    return NextResponse.json({ 
      success: true, 
      message: '定时任务已取消' 
    });
  } catch (error) {
    console.error('取消定时任务失败:', error);
    return NextResponse.json(
      { success: false, error: '取消定时任务失败' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    active: scheduledJob !== null,
    message: scheduledJob ? '定时任务正在运行' : '没有运行中的定时任务'
  });
}