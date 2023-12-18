import { Candidate } from "./Candidate";
import { ElectorialArea } from "./ElectorialArea";

export interface ElectorialPosition {
  id?: string;
  positionName: string;
  numberRequired: number;
  event: Event;
  areas?: ElectorialArea[];
  candidates?: Candidate[];
  createdAt?: Date;
  updatedAt?: Date;
}
