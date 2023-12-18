import type { Auth } from "./Auth";
import { ElectorialArea } from "./ElectorialArea";
import { Event } from "./Event";
import { PollingCenter } from "./PollingCenter";

export interface User extends Auth {
  id?: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  name?: string;
  address: string;
  oldAuthString?: string;
  role: "FieldOfficer" | "Supervisor" | "Admin" | "Super";
  email: string;
  createdBy: string;
  auth?: Auth;
  createdAt?: string;
  updatedAt?: string;
  gender: string;
  phone: string;
  idNumber?: string;
  idType?: string;
  img?: string;
  host: string;
  electorialArea?: ElectorialArea;
  pollingCenter?: PollingCenter;
  politicalEvent?: Event;
}
