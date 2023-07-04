const mongoose = require("mongoose");
require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD));
  console.log("connected to db");
}
