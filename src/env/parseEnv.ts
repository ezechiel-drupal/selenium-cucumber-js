import { readFileSync } from "fs";

export const getJsonFromFile = <T = Record<string, string>>(
  path: string
): T => {
  const fullPath = `${process.cwd()}${path}`;
  const fileContent = readFileSync(fullPath, "utf8");
  return JSON.parse(fileContent) as T;
};

export const env = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`No environment variable found for ${key}`);
  }
  return value;
};

export const envNumber = (key: string): number => {
  return Number(env(key));
};
