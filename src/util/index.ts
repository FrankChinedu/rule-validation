/* eslint-disable @typescript-eslint/no-explicit-any */
export function throwIfUndefined<T>(x: T | undefined, name: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}

export const getDataValue = (
  data: { [key: string]: any },
  value: string[] | any,
): any => {
  if (Array.isArray(data)) {
    if (data[value[0] - 1]) {
      return data[value[0] - 1];
    }
    return data;
  }
  if (typeof data === 'string') {
    if (isNaN(+value[0])) {
      return data;
    }
    return data[value[0]];
  }
  if (typeof data !== 'object' || !value.length) return data;
  const newData = data[value[0]];
  if (!newData) return newData;

  return getDataValue(newData, value.slice(1));
};
