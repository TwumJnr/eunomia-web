import { ElectorialArea } from "./ElectorialArea";
import { ElectorialPosition } from "./ElectorialPosition";
import { User } from "./Users";

export interface Event {
  id?: string;
  eventName: string;
  eventDate: string;
  // results?: Result[];
  participatingAreas?: ElectorialArea[];
  positions?: ElectorialPosition[];
  createdBy?: User;
  createdAt?: string;
  updatedAt?: string;
}
