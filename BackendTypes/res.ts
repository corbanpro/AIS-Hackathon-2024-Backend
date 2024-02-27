import { TDbEvent, TDbScan, TDbUser } from "./db";

export type TErrorRes = {
  status: "failed";
  message: string;
  log: string;
};

export type TGetScansRes = {
  status: "success";
  scans: TDbScan[];
};

export type TSendScanRes = {
  status: "success";
};

export type TGetUserAttendanceRes = {
  status: "success";
  scans: TDbScan[];
  events: TDbEvent[];
};

export type TGetUpcomingEventsRes = {
  status: "success";
  events: TDbEvent[];
};

export type TEventSummaries = {
  scansPerEvent: { [key: number]: number };
};

export type TGetEventSummariesRes = {
  status: "success";
  eventSummaries: TEventSummaries;
};
export type TAttemptLoginRes = {
  status: "success";
  user: TDbUser;
};
