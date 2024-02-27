import express from "express";
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
} as const satisfies TErrors;

type TValidErrors = keyof typeof errors;

type TErrors = {
  [key: string]: {
    status: "failed";
    message: string;
    log: string;
  };
};

export default function SendError(res: express.Response, error: TValidErrors) {
  res.send(errors[error]);
  console.log(errors[error].log);
}
