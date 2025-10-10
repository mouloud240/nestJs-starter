export type RenameKey<T, Oldkey extends keyof T, Newkey extends string> = Omit<
  T,
  Oldkey
> & { [k in Newkey]: T[Oldkey] };

