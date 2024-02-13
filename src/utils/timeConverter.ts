export const convertTime = (time: number) => {
  return time.toFixed(1);
};
export const convertPoint = (time: number) => {
  return Number((2 ** (time / 10)).toFixed(2));
};

export const f = (x: number) => {
  x -= 5;
  if (x < 0) {
    return Math.pow(1 - (x * x) / 5 / 5, 0.4);
  }
  return Math.pow(x / 10, 2.5) + 1;
};

export const fixed = (x: number, figure: number) => {
  return Math.floor(x * 10 ** figure) / (10 ** figure);
}