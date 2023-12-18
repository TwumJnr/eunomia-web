import { ElectorialArea } from "./ElectorialArea";
import { Result } from "./Result";
import { User } from "./Users";

export interface PollingCenter {
  id?: string;
  centerName: string;
  electorialArea: ElectorialArea;
  results?: Result[];
  createdBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}
