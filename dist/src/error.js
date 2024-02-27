"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
};
function SendError(res, error) {
    res.send(errors[error]);
    console.log(errors[error].log);
}
exports.default = SendError;
