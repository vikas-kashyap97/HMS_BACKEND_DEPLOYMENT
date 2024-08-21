import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL, { 
        dbName: "HOSPITAL_MANAGEMENT_SYSTEM_DEPLOYED_APP"
        
     })
     .then(() => {
        console.log("Connected to database!");
      })
      .catch((err) => {
        console.log(`Some error occured while connecting to database: ${err}`);
      });
};