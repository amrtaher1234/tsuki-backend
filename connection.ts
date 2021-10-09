import mongoose from "mongoose";

let database: mongoose.Connection;
const connect = () => {
  const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/etbo5ly";
  if (database) {
    return;
  }
  mongoose.connect(uri, {});
  database = mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};

export default connect;
