export type TValidEventType = "socialize" | "learn" | "serve" | "discover" | "connect";

export type TEventTypeThresholds = {
  [key: string]: number;
};

export const eventTypeThresholds: TEventTypeThresholds = {
  socialize: 2,
  learn: 2,
  serve: 4,
  discover: 4,
  connect: 3,
};

export type TDbUser = {
  netId: string;
  firstName: string;
  lastName: string;
  isAdmin: number;
  dateCreated?: number | Date;
};

export type TDbEvent = {
  eventId: number;
  title: string;
  startTime: number;
  endTime: number;
  type: TValidEventType;
  notes?: string;
  waiverUrl?: string;
  location: string;
  createdBy?: string;
  createdDate?: number;
  editedBy?: string;
  editDate?: number;
};

export type TDbScan = {
  netId: string;
  eventId: number;
  scannerId: string;
  timestamp?: number;
  plusOne: number;
};
