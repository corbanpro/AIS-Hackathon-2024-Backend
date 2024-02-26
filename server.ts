import express from "express";
import cors from "cors";
import db from "./src/initializeDatabase";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  db("User")
    .select()
    .then((users) => {
      res.json(users);
    });
  console.log("User selected");
});

app.post("/scan", (req, res) => {
  const { memberNetId, plusOne, adminNetId, eventId } = req.body;
  db("Scan")
    .insert({
      netId: memberNetId,
      eventId: eventId,
      scannerId: adminNetId,
      timestamp: new Date(),
      plusOne: plusOne,
    })
    .then(() => {
      res.json({ status: "success" });
      console.log("Scan inserted");
    });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
