import type { Auth } from "./Auth";

export interface User extends Auth {
  id?: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  name?: string;
  oldAuthString?: string;
  responsibility: string;
  email: string;
  createdBy: string;
  auth?: Auth;
  createdAt?: string;
  updatedAt?: string;
}
