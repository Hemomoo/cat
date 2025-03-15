import bilibiliData from '../../../content/bilibili/index.json';
import BilibiliPlayer from '@/components/BilibiliPlayer';

export default function MusicPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">音乐播放</h1>
      
      {bilibiliData.videoList && bilibiliData.videoList.length > 0 ? (
        <BilibiliPlayer videoList={bilibiliData.videoList} />
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          没有找到音乐数据
        </div>
      )}
    </div>
  );
}