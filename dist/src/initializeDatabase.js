"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const db = (0, knex_1.default)({
    client: "sqlite3",
    connection: {
        filename: "./db.sqlite",
    },
    useNullAsDefault: true,
});
async function InitializeDatabase() {
    // Drop tables if they exist
    await db.schema.dropTableIfExists("Scan");
    await db.schema.dropTableIfExists("Event");
    await db.schema.dropTableIfExists("User");
    // Create User table
    await db.schema.createTable("User", (table) => {
        table.string("netId").primary();
        table.string("firstName").notNullable();
        table.string("lastName").notNullable();
        table.dateTime("dateCreated").defaultTo(db.fn.now());
        table.boolean("isAdmin").defaultTo(false);
    });
    // Create Event table
    await db.schema.createTable("Event", (table) => {
        table.increments("eventId").primary();
        table.string("title").notNullable();
        table.dateTime("startTime").notNullable();
        table.dateTime("endTime").nullable();
        table.string("type").notNullable();
        table.string("notes").nullable();
        table.string("waiverUrl").nullable();
        table.string("location").notNullable();
        table.string("createdBy").references("netId").inTable("User");
        table.dateTime("createdDate").defaultTo(db.fn.now());
        table.string("editedBy").references("netId").inTable("User").defaultTo(null);
        table.dateTime("editDate").defaultTo(db.fn.now());
    });
    // Create Scan table
    await db.schema.createTable("Scan", (table) => {
        table.string("netId").references("netId").inTable("User");
        table.integer("eventId").references("eventId").inTable("Event");
        table.string("scannerId").references("netId").inTable("User");
        table.dateTime("timestamp").defaultTo(db.fn.now());
        table.boolean("plusOne").notNullable();
        table.primary(["netId", "eventId", "scannerId"]);
    });
    // Insert sample rows
    await db("User").insert([
        {
            netId: "johndoe24",
            firstName: "John",
            lastName: "Doe",
            dateCreated: new Date(),
            isAdmin: true,
        },
        {
            netId: "janesmith101",
            firstName: "Jane",
            lastName: "Smith",
            dateCreated: new Date(),
            isAdmin: false,
        },
    ]);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await db("Event").insert([
        {
            title: "Event 1",
            startTime: tomorrow,
            endTime: tomorrow,
            type: "type 1",
            notes: "notes 1",
            createdBy: "johndoe24",
            createdDate: new Date(),
            editedBy: "johndoe24",
            editDate: new Date(),
            location: "BYU",
            waiverUrl: "https://www.google.com",
        },
        {
            title: "Event 2",
            startTime: tomorrow,
            endTime: tomorrow,
            type: "type 2",
            notes: "notes 2",
            createdBy: "johndoe24",
            createdDate: new Date(),
            editedBy: "johndoe24",
            editDate: new Date(),
            location: "BYU",
        },
        {
            title: "Event 3",
            startTime: new Date(),
            endTime: new Date(),
            type: "type 3",
            notes: "notes 3",
            createdBy: "johndoe24",
            createdDate: new Date(),
            editedBy: "johndoe24",
            editDate: new Date(),
            location: "BYU",
        },
        {
            title: "Event 4",
            startTime: new Date(),
            endTime: new Date(),
            type: "type 4",
            notes: "notes 4",
            createdBy: "johndoe24",
            createdDate: new Date(),
            editedBy: "johndoe24",
            editDate: new Date(),
            location: "BYU",
        },
        {
            title: "Event 5",
            startTime: new Date(),
            endTime: new Date(),
            type: "type 5",
            notes: "notes 5",
            createdBy: "janesmith101",
            createdDate: new Date(),
            editedBy: "janesmith101",
            editDate: new Date(),
            location: "BYU",
        },
        {
            title: "Event 6",
            startTime: new Date(),
            endTime: new Date(),
            type: "type 6",
            notes: "notes 6",
            createdBy: "johndoe24",
            createdDate: new Date(),
            editedBy: "johndoe24",
            editDate: new Date(),
            location: "BYU",
        },
        {
            title: "Event 7",
            startTime: new Date(),
            endTime: new Date(),
            type: "type 2",
            notes: "notes 2",
            createdBy: "johndoe24",
            createdDate: new Date(),
            editedBy: "johndoe24",
            editDate: new Date(),
            location: "BYU",
        },
        {
            title: "Event 8",
            startTime: new Date(),
            endTime: new Date(),
            type: "type 2",
            notes: "notes 2",
            createdBy: "johndoe24",
            createdDate: new Date(),
            editedBy: "johndoe24",
            editDate: new Date(),
            location: "BYU",
        },
    ]);
    await db("Scan").insert([
        {
            netId: "janesmith101",
            eventId: 1,
            scannerId: "johndoe24",
            timestamp: new Date(),
            plusOne: true,
        },
        {
            netId: "johndoe24",
            eventId: 2,
            scannerId: "johndoe24",
            timestamp: new Date(),
            plusOne: false,
        },
        {
            netId: "janesmith101",
            eventId: 3,
            scannerId: "johndoe24",
            timestamp: new Date(),
            plusOne: true,
        },
        {
            netId: "johndoe24",
            eventId: 4,
            scannerId: "johndoe24",
            timestamp: new Date(),
            plusOne: false,
        },
        {
            netId: "johndoe24",
            eventId: 5,
            scannerId: "janesmith101",
            timestamp: new Date(),
            plusOne: true,
        },
        {
            netId: "johndoe24",
            eventId: 6,
            scannerId: "janesmith101",
            timestamp: new Date(),
            plusOne: true,
        },
        {
            netId: "johndoe24",
            eventId: 7,
            scannerId: "janesmith101",
            timestamp: new Date(),
            plusOne: true,
        },
        {
            netId: "johndoe24",
            eventId: 8,
            scannerId: "janesmith101",
            timestamp: new Date(),
            plusOne: true,
        },
    ]);
    console.log("Database initialized");
}
InitializeDatabase();
exports.default = db;
