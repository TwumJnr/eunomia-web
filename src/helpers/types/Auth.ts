export interface Auth {
  id?: string;
  username: string;
  apiKey?: string;
  status: boolean;
  firstTime: boolean;
  reset: boolean;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}
