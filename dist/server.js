"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const initializeDatabase_1 = __importDefault(require("./src/initializeDatabase"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    (0, initializeDatabase_1.default)("User")
        .select()
        .then((users) => {
        res.json(users);
    });
    console.log("User selected");
});
app.post("/scan", (req, res) => {
    const { memberNetId, plusOne, adminNetId, eventId } = req.body;
    (0, initializeDatabase_1.default)("Scan")
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
