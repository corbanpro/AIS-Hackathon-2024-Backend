"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const initializeDatabase_1 = __importDefault(require("./src/initializeDatabase"));
const error_1 = __importDefault(require("./src/error"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ############################## Test API ##############################
app.get("/", (req, res) => {
    (0, initializeDatabase_1.default)("User")
        .select()
        .then((users) => {
        res.send(users);
    });
    console.log("User selected");
});
// ############################## Scan API ##############################
app.get("/GetScans", (req, res) => {
    console.log("Get Scans");
    (0, initializeDatabase_1.default)("Scan")
        .select()
        .then((scans) => {
        res.send({ status: "success", data: scans });
    });
});
app.post("/InsertScan", (req, res) => {
    const { memberNetId, plusOne, adminNetId, eventId } = req.body;
    console.log("Insert scan");
    (0, initializeDatabase_1.default)("Scan")
        .insert({
        netId: memberNetId,
        eventId: eventId,
        scannerId: adminNetId,
        timestamp: new Date(),
        plusOne: plusOne,
    })
        .then(() => {
        res.send({ status: "success" });
    })
        .catch((err) => {
        if (err.errno === 19) {
            (0, error_1.default)(res, "duplicateScan");
            return;
        }
        (0, error_1.default)(res, "unknownError");
    });
});
// ############################## Event Info API ##############################
app.get("/GetUserAttendance/:netId", (req, res) => {
    console.log("User Attendance");
    const netId = req.params.netId;
    (0, initializeDatabase_1.default)("Scan")
        .where("netId", netId)
        .select()
        .then((scans) => {
        (0, initializeDatabase_1.default)("Event")
            .whereIn("eventId", scans.map((scan) => scan.eventId))
            .select()
            .then((events) => {
            res.send({ status: "success", scans: scans, events: events });
        });
    });
});
app.get("/GetUpcomingEvents", (req, res) => {
    console.log("Upcoming Events");
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() + 1);
    (0, initializeDatabase_1.default)("Event")
        .where("startTime", ">", twoHoursAgo)
        .select()
        .then((events) => {
        res.send({ status: "success", events: events });
    });
});
// ############################## Auth API ##############################
app.post("/AttemptLogin", (req, res) => {
    const { netId } = req.body;
    console.log("Attempt login");
    (0, initializeDatabase_1.default)("User")
        .where({ netId: netId })
        .select()
        .then((user) => {
        if (user.length === 0) {
            (0, error_1.default)(res, "noUser");
            return;
        }
        res.send({ status: "success", user: user });
    });
});
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
