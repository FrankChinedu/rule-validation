/* eslint-disable @typescript-eslint/no-explicit-any */
export function throwIfUndefined<T>(x: T | undefined, name: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}

export const getDataValue = (
  data: { [key: string]: any },
  value: string[],
): any => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') return data;
  if (typeof data !== 'object' || !value.length) return data;
  const newData = data[value[0]];
  if (!newData) return newData;

  return getDataValue(newData, value.slice(1));
};
