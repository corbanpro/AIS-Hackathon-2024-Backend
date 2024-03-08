"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const initializeDatabase_1 = __importDefault(require("./src/initializeDatabase"));
const error_1 = __importDefault(require("./src/error"));
const db_1 = require("./BackendTypes/db");
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
        res.send({ status: "success", scans: scans });
    });
});
app.post("/InsertScan", (req, res) => {
    const { netId, plusOne, scannerId, eventId } = req.body;
    if (!netId || !scannerId || !eventId) {
        (0, error_1.default)(res, "insufficientData");
        return;
    }
    console.log("Insert scan");
    (0, initializeDatabase_1.default)("Scan")
        .insert({
        netId: netId,
        eventId: eventId,
        scannerId: scannerId,
        timestamp: new Date(),
        plusOne: plusOne,
    })
        .then(() => {
        res.send({ status: "success" });
    })
        .catch((err) => {
        if (err.code === "SQLITE_CONSTRAINT") {
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
    if (!netId) {
        (0, error_1.default)(res, "insufficientData");
        return;
    }
    (0, initializeDatabase_1.default)("Scan")
        .where("netId", netId)
        .select()
        .then((scans) => {
        (0, initializeDatabase_1.default)("Event")
            .whereIn("eventId", scans.map((scan) => scan.eventId))
            .select()
            .then((events) => {
            res.send({
                status: "success",
                scans: scans,
                events: events,
            });
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
app.get("/GetEventSummaries", async (req, res) => {
    console.log("Event Summaries");
    const lastFiveEvents = await (0, initializeDatabase_1.default)("Event")
        .select()
        .orderBy("startTime", "desc")
        .limit(5)
        .then((events) => {
        return events;
    });
    const last5EventScans = await (0, initializeDatabase_1.default)("Scan")
        .whereIn("eventId", lastFiveEvents.map((event) => event.eventId))
        .select()
        .then((scans) => {
        return scans;
    });
    const scansPerEvent = last5EventScans.reduce((acc, scan) => {
        acc[scan.eventId] = {
            numScans: (acc[scan.eventId]?.numScans || 0) + 1,
            eventname: lastFiveEvents.find((event) => event.eventId === scan.eventId)?.title,
            eventDate: lastFiveEvents.find((event) => event.eventId === scan.eventId)?.startTime,
        };
        return acc;
    }, {});
    const totalAttendance = await (0, initializeDatabase_1.default)("Scan")
        .select()
        .then((scans) => scans.reduce((acc, scan) => {
        return acc + 1 + scan.plusOne;
    }, 0));
    const raffleEligibleHavingClause = Object.keys(db_1.eventTypeThresholds)
        .map((eventType) => {
        return `sum(case when type = '${eventType}' then 1 else 0 end) >= ${db_1.eventTypeThresholds[eventType]}`;
    })
        .join(" AND ");
    const raffleEligibleStudents = await (0, initializeDatabase_1.default)("Scan")
        .join("Event", "Scan.eventId", "Event.eventId")
        .groupBy("netId")
        .having(initializeDatabase_1.default.raw(raffleEligibleHavingClause))
        .select()
        .then((students) => students.map((student) => student.netId));
    const eventSummaries = {
        scansPerEvent,
        totalAttendance,
        raffleEligibleStudents,
    };
    res.send({ status: "success", eventSummaries: eventSummaries });
});
// ############################## Auth API ##############################
app.post("/AttemptLogin", (req, res) => {
    const { netId } = req.body;
    if (!netId) {
        (0, error_1.default)(res, "insufficientData");
        return;
    }
    console.log("Attempt login");
    (0, initializeDatabase_1.default)("User")
        .where({ netId: netId })
        .select()
        .then((user) => {
        if (user.length === 0) {
            (0, error_1.default)(res, "noUser");
            return;
        }
        res.send({ status: "success", user: user[0] });
    });
});
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
