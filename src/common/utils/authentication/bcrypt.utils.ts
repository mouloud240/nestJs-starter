import * as bcrypt from 'bcryptjs';
export function generateHash(input: string): Promise<string> {
  return bcrypt.hash(input, 10);
}

export function compareHash(input: string, hash: string): Promise<boolean> {
  return bcrypt.compare(input, hash);
}
