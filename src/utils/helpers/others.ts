function getNiceTime(date: number | string) {
  const actual_date = new Date(date);
  const hours = actual_date.getHours();
  const minutes = actual_date.getMinutes();
  return `${hours}:${minutes}`;
}

export {getNiceTime};
