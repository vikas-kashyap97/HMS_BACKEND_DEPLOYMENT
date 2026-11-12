import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME || "HOSP_MGMT_DEPLOY",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      // Don't print the full error: it can contain the connection string.
      console.error(`Error connecting to database: ${err.name}: ${err.message}`);
      process.exit(1);
    });
};
