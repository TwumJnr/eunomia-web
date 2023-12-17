import { Event } from "./Event";
import { User } from "./Users";

export interface ElectorialArea {
  id?: string;
  areaName: string;
  // candidates: Candidate[];
  // centers: PollingCenter[];
  // positions: ElectorialPosition[];
  event: Event;
  createdBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}
