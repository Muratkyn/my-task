export const formatTime = (time: string) => time.split(",")[0];

export const formatDurationTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

export const convertToSeconds = (time: string) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};
export const calculateDuration = (startTime: string, endTime: string) => {
  const startSeconds = convertToSeconds(startTime);
  const endSeconds = convertToSeconds(endTime);
  return formatDurationTime(endSeconds - startSeconds);
};
