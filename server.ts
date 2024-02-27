import express from "express";
import cors from "cors";
import db from "./src/initializeDatabase";
import SendError from "./src/error";

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
      res.send({ status: "success", data: scans });
    });
});

app.post("/InsertScan", (req, res) => {
  const { memberNetId, plusOne, adminNetId, eventId } = req.body;
  console.log("Insert scan");
  db("Scan")
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
          res.send({ status: "success", scans: scans, events: events });
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
      res.send({ status: "success", events: events });
    });
});

// ############################## Auth API ##############################

app.post("/AttemptLogin", (req, res) => {
  const { netId } = req.body;
  console.log("Attempt login");
  db("User")
    .where({ netId: netId })
    .select()
    .then((user) => {
      if (user.length === 0) {
        SendError(res, "noUser");
        return;
      }
      res.send({ status: "success", user: user });
    });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
