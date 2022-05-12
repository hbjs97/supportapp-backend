import type { config as base } from './envs/default';

export type Objectype = Record<string, unknown>;
export type Default = typeof base;
export type Config = Default;
