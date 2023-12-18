export interface Auth {
  id?: string;
  username: string;
  apiKey?: string;
  status: boolean;
  reset: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
