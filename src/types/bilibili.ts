export interface BilibiliVideo {
  id: number;
  name: string;
  url: string;
}

export interface BilibiliData {
  isMultiPart: boolean;
  videoList: BilibiliVideo[];
}