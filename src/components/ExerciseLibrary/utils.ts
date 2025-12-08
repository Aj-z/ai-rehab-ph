export const parseDurationSeconds = (duration: string) => {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
};
