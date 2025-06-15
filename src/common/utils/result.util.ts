export type result<T, E = Error> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: E;
    };
export function ok<T>(value: T): result<T> {
  return { ok: true, value };
}
export function err<E = Error>(error: E): result<never, E> {
  return { ok: false, error };
}
