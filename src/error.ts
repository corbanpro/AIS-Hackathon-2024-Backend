import express from "express";
import { TErrorRes } from "../BackendTypes/res";

const errors = {
  duplicateScan: {
    status: "failed",
    message: "Duplicate scan.",
    log: "duplicate scan attempted",
  },
  unknownError: {
    status: "failed",
    message: "Unknown error. Please try again.",
    log: "unknown error occurred",
  },
  noScans: {
    status: "failed",
    message: "No scans found.",
    log: "no scans found",
  },
  noUser: {
    status: "failed",
    message: "No user found.",
    log: "no user found",
  },
  insufficientData: {
    status: "failed",
    message: "Insufficient data.",
    log: "insufficient data",
  },
} as const satisfies { [key: string]: TErrorRes };

type TValidErrors = keyof typeof errors;

export default function SendError(res: express.Response, error: TValidErrors) {
  res.send(errors[error]);
  console.log(errors[error].log);
}
