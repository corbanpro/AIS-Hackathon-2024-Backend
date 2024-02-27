import express from "express";
import cors from "cors";
import db from "./src/initializeDatabase";
import SendError from "./src/error";
import {
  TAttemptLoginRes,
  TGetEventSummariesRes,
  TGetScansRes,
  TGetUpcomingEventsRes,
  TGetUserAttendanceRes,
  TEventSummaries,
} from "./BackendTypes/res";

const app = express();
app.use(cors());
app.use(express.json());

// ############################## Test API ##############################
app.get("/", (req, res) => {
  db("User")
    .select()
    .then((users) => {
      res.send(users);
    });
  console.log("User selected");
});

// ############################## Scan API ##############################

app.get("/GetScans", (req, res) => {
  console.log("Get Scans");
  db("Scan")
    .select()
    .then((scans) => {
      res.send({ status: "success", scans: scans } satisfies TGetScansRes);
    });
});

app.post("/InsertScan", (req, res) => {
  const { netId, plusOne, scannerId, eventId } = req.body;
  if (!netId || !scannerId || !eventId) {
    SendError(res, "insufficientData");
    return;
  }
  console.log("Insert scan");
  db("Scan")
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
        SendError(res, "duplicateScan");
        return;
      }
      SendError(res, "unknownError");
    });
});

// ############################## Event Info API ##############################

app.get("/GetUserAttendance/:netId", (req, res) => {
  console.log("User Attendance");
  const netId = req.params.netId;
  if (!netId) {
    SendError(res, "insufficientData");
    return;
  }
  db("Scan")
    .where("netId", netId)
    .select()
    .then((scans) => {
      db("Event")
        .whereIn(
          "eventId",
          scans.map((scan) => scan.eventId)
        )
        .select()
        .then((events) => {
          res.send({
            status: "success",
            scans: scans,
            events: events,
          } satisfies TGetUserAttendanceRes);
        });
    });
});

app.get("/GetUpcomingEvents", (req, res) => {
  console.log("Upcoming Events");
  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() + 1);

  db("Event")
    .where("startTime", ">", twoHoursAgo)
    .select()
    .then((events) => {
      res.send({ status: "success", events: events } satisfies TGetUpcomingEventsRes);
    });
});

app.get("/GetEventSummaries", async (req, res) => {
  console.log("Event Summaries");
  const lastFiveEvents = await db("Event")
    .select()
    .orderBy("startTime", "desc")
    .limit(5)
    .then((events) => {
      return events;
    });

  const scans = await db("Scan")
    .whereIn(
      "eventId",
      lastFiveEvents.map((event) => event.eventId)
    )
    .select()
    .then((scans) => {
      return scans;
    });

  const scansPerEvent = scans.reduce((acc, scan) => {
    acc[scan.eventId] = (acc[scan.eventId] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  const eventSummaries: TEventSummaries = {
    scansPerEvent: scansPerEvent,
  };

  res.send({ status: "success", eventSummaries: eventSummaries } satisfies TGetEventSummariesRes);
});

// ############################## Auth API ##############################

app.post("/AttemptLogin", (req, res) => {
  const { netId } = req.body;
  if (!netId) {
    SendError(res, "insufficientData");
    return;
  }
  console.log("Attempt login");
  db("User")
    .where({ netId: netId })
    .select()
    .then((user) => {
      if (user.length === 0) {
        SendError(res, "noUser");
        return;
      }
      res.send({ status: "success", user: user[0] } satisfies TAttemptLoginRes);
    });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
