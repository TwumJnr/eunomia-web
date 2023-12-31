import { Candidate } from "./Candidate";
import { Event } from "./Event";
import { PollingCenter } from "./PollingCenter";
import { User } from "./Users";

export interface ElectorialArea {
  id?: string;
  areaName: string;
  candidates?: Candidate[];
  centers?: PollingCenter[];
  event: Event;
  createdBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}
