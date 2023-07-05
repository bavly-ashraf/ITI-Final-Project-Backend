const mongoose = require("mongoose");
require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)
  );
  console.log("connected to db");
}
// const mongoose = require("mongoose");
// require("dotenv").config();

// main().catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect(
//     // process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)
//     process.env.MONGO_URI
//   );

//   console.log("connected to db");
// }
