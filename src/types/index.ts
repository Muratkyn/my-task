export type SubtitleTable = {
  id: number;
  value: string;
};

export type SubtitleData = {
  id: string;
  startTime: string;
  startSeconds: number;
  endTime: string;
  endSeconds: number;
  text: string;
};

export type SubtitleState = {
  parsedSubtitles: SubtitleData[];
};

export type RootState = {
  subtitle: SubtitleState;
};

export type UpdatedSubtitleData<T extends keyof SubtitleData> = {
  id: string;
  field: T;
  value: SubtitleData[T];
};

export type VideoPlayerProps = {
  searchTime: number | null;
};
