export interface MapOf<T> {
  [key: string]: T;
}

export const store: Record<string, unknown> = {};

export const setter: Record<string, MapOf<Function>> = {};
