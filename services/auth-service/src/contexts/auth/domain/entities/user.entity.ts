export interface User {
  id: string;
  email: string;
  name?: string | null;
  passwordHash: string;
  role: string;
}
