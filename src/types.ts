export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (...args: Arguments) => T;

export type Plain<T> = T;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Flatten<T> = T extends unknown[] ? T[number] : T extends object ? T[keyof T] : never;
export type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : never;

export type KeyOfType<Entity, U> = {
  [P in keyof Required<Entity>]: Required<Entity>[P] extends U ? P : Required<Entity>[P] extends U[] ? P : never;
}[keyof Entity];
