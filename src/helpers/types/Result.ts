import { Candidate } from "./Candidate";
import { ElectorialArea } from "./ElectorialArea";
import { ElectorialPosition } from "./ElectorialPosition";
import { Event } from "./Event";
import { PollingCenter } from "./PollingCenter";
import { User } from "./Users";

export interface Result {
  id?: string;
  voteCount: number;
  candidate: Candidate;
  event: Event;
  electorialPosition: ElectorialPosition;
  pollingCenter: PollingCenter;
  electorialArea: ElectorialArea;
  addedBy?: User;
  createdAt?: string;
  updatedAt?: string;
}
