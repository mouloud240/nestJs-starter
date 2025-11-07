import * as argon2 from 'argon2';
const ARGON2_CONFIG = {
  type: argon2.argon2id,
  memoryCost: 2 ** 14, // 16 MB
  timeCost: 2,
  parallelism: 4,
};
export function generateHash(input: string): Promise<string> {
  return argon2.hash(input, ARGON2_CONFIG);
}

export function compareHash(input: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, input);
}
