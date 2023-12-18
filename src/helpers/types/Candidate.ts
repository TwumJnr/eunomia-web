import { ElectorialArea } from "./ElectorialArea";
import { ElectorialPosition } from "./ElectorialPosition";
import { Event } from "./Event";
import { Result } from "./Result";
import { User } from "./Users";

export interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  name?: string;
  gender: string;
  img?: string;
  results?: Result[];
  electorialArea?: ElectorialArea;
  event?: Event;
  electorialPosition?: ElectorialPosition;
  createdBy?: User;
  createdAt?: string;
  updatedAt?: string;
}
