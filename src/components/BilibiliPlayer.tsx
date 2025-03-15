'use client';

import { useState, useEffect } from 'react';

interface VideoItem {
  id: number;
  name: string;
  url: string;
}

interface BilibiliPlayerProps {
  videoList: VideoItem[];
}

export default function BilibiliPlayer({ videoList }: BilibiliPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string>('');

  // 选择第一个视频作为默认视频
  useEffect(() => {
    if (videoList && videoList.length > 0 && !selectedVideo) {
      setSelectedVideo(videoList[0]);
    }
  }, [videoList, selectedVideo]);

  // 当选中视频变化时，更新嵌入URL
  useEffect(() => {
    if (selectedVideo) {
      // 将B站URL转换为嵌入URL
      const url = new URL(selectedVideo.url);
      const bvid = url.pathname.split('/')[2].replace(/\/?/, '');
      const page = url.searchParams.get('p') || '1';
      
      // 构建嵌入URL，启用弹幕，设置初始音量
      const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=${page}&high_quality=1&danmaku=1&volume=100`;
      setEmbedUrl(embedUrl);
    }
  }, [selectedVideo]);

  const handleVideoSelect = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* 视频播放器 */}
      <div className="w-full md:w-2/3">
        {embedUrl ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow">
            <iframe
              src={embedUrl}
              scrolling="no"
              frameBorder="no"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">请选择要播放的视频</p>
          </div>
        )}
        
        {selectedVideo && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{selectedVideo.name}</h2>
            <p className="text-sm text-gray-500">视频ID: {selectedVideo.id}</p>
          </div>
        )}
      </div>

      {/* 视频列表 */}
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium">视频列表</h2>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="divide-y divide-gray-200">
            {videoList.map((video, index) => (
              <li 
                key={`video-${index}`}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedVideo?.id === video.id ? "bg-blue-50" : ""}`}
                onClick={() => handleVideoSelect(video)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{video.name}</p>
                    <p className="text-xs text-gray-500">视频ID: {video.id}</p>
                  </div>
                  {selectedVideo?.id === video.id && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        播放中
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}