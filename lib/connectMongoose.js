/* eslint-disable no-undef */
import mongoose from "mongoose";

export default async function connectMongoose() {
  try {
    //MongoDB database connection====================================================
    await mongoose.connect("mongodb://localhost/nodepop");
    console.log("Connected to MongoDB");

    //Handling of connection and disconnection events================================
    mongoose.connection.on("connected", () => {
      console.log("Mongoose has connected to the database.");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose has disconnected from the database.");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    //Handle disconnection when the application shuts down==========================
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to application termination.");
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
