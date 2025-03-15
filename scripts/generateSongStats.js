import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { console } from 'inspector';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 检查并删除已存在的cat.json文件
const jsonFilePath = join(__dirname, '../cat.json');
if (existsSync(jsonFilePath)) {
  console.log('发现已存在的cat.json文件，正在删除...');
  unlinkSync(jsonFilePath);
  console.log('已删除旧的cat.json文件');
}

// 读取Excel文件
console.log('正在读取Excel文件...');
const workbook = readFile(join(__dirname, '../cat.xlsx'));
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
console.log('Excel文件读取成功');

// 将工作表转换为JSON数据
console.log('正在转换工作表数据...');
const data = utils.sheet_to_json(worksheet);
console.log("🚀 ~ data:", data)
console.log(`成功转换${data.length}条数据记录`);

// 统计歌曲演唱次数
console.log('开始统计歌曲演唱次数...');
const songStats = {};
data.forEach(row => {
    // console.log("🚀 ~ row:", row)
  if (row['歌曲名称'] || row['歌名'] || row.song) {
    const songTitle = row['歌曲名称'] || row['歌名'] || row.song;
    console.log("🚀 ~ 处理歌曲:", songTitle);
    songStats[songTitle] = (songStats[songTitle] || 0) + 1;
  }
});

// 转换为数组并排序
console.log('正在对歌曲数据进行排序...');
const sortedSongs = Object.entries(songStats)
  .map(([title, count]) => ({ title, count }))
  .sort((a, b) => b.count - a.count);
console.log(`共统计到${sortedSongs.length}首不同的歌曲`);

// 写入JSON文件
console.log('正在写入统计结果到JSON文件...');
writeFileSync(
  jsonFilePath,
  JSON.stringify({ songs: sortedSongs }, null, 2)
);

console.log('已成功生成歌曲统计数据：cat.json');