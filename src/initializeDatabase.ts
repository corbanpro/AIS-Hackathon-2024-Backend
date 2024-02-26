import knex from "knex";

const db = knex({
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
    table.string("firstName");
    table.string("lastName");
    table.dateTime("dateCreated").defaultTo(db.fn.now());
    table.boolean("isAdmin").defaultTo(false);
  });

  // Create Event table
  await db.schema.createTable("Event", (table) => {
    table.increments("eventId").primary();
    table.string("title");
    table.dateTime("startTime");
    table.dateTime("endTime");
    table.string("type");
    table.string("notes");
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
    table.boolean("plusOne");
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

  await db("Event").insert([
    {
      title: "Event 1",
      startTime: new Date(),
      endTime: new Date(),
      type: "type 1",
      notes: "notes 1",
      createdBy: "johndoe24",
      createdDate: new Date(),
      editedBy: "johndoe24",
      editDate: new Date(),
    },
    {
      title: "Event 2",
      startTime: new Date(),
      endTime: new Date(),
      type: "type 2",
      notes: "notes 2",
      createdBy: "jane.smith",
      createdDate: new Date(),
      editedBy: "jane.smith",
      editDate: new Date(),
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
      netId: "janesmith101",
      eventId: 2,
      scannerId: "johndoe24",
      timestamp: new Date(),
      plusOne: false,
    },
  ]);

  console.log("Database initialized");
}

InitializeDatabase();

export default db;
