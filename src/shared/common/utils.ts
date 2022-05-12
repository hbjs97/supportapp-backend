import bcrypt from 'bcrypt';
import { isArray } from 'lodash';
import type { Optional } from 'src/types';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function validateHash(password: Optional<string>, hash: Optional<string>): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''));

  if (!m) {
    throw new Error("The function does not contain a statement matching 'return variableName;'");
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts[memberParts.length - 1];
}

export function hasElementArray(value?: any): value is any[] {
  return isArray(value) && !!value.length;
}

export function isJsonString(value: string): boolean {
  try {
    const parsedValue = JSON.parse(value);
    return typeof parsedValue === 'object';
  } catch (error: any) {
    return false;
  }
}

export function getMaxPage(perPage: number, maxCount: number): number {
  if (maxCount <= perPage) return 0;
  return Math.ceil(maxCount / perPage) - 1;
}

export function isKeyOfSchema<T>(schema: T, key: unknown): key is keyof T {
  return typeof key === 'string' && key in schema;
}

export function excludeKeyOfSchema<T extends object, K extends keyof T>(schema: T, keys: readonly K[]): Omit<T, typeof keys[number]> {
  const targetSchema = { ...schema };
  keys.forEach((v: keyof T) => {
    delete targetSchema[v];
  });
  return targetSchema;
}

export function removeUndefined<T>(argv: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(argv).filter(([, value]: [string, unknown]) => value !== undefined));
}
