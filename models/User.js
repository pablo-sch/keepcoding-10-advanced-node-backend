import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

import { createTransport, sendEmail, generatePreviewURL } from "../lib/emailManager.js";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    avatar: String,
  },
  {
    collection: "users", // to force the name of the collection
    versionKey: false, // to deactivate the field ‘__v’ in MongoDB
  }
);

// password encryption coming from my iniDB.js script
userSchema.statics.hashPassword = (clearPassword) => {
  return bcrypt.hash(clearPassword, 7);
};

// compare login password (not encrypted) with DB password (encrypted)
userSchema.methods.comparePassword = function (clearPassword) {
  return bcrypt.compare(clearPassword, this.password);
};

//WEB-SOCKET****************************************************************************
// Sends an email to the user using the configured transport and logs a preview URL.
userSchema.methods.sendEmail = async function (subject, body) {
  const transport = createTransport();
  const result = await sendEmail({
    transport,
    to: this.email,
    subject,
    body,
  });
  const previewURL = generatePreviewURL(result);
  console.log("SOCKET.IO: Simulated E-Mail ", previewURL);
};
//**************************************************************************************

const User = mongoose.model("User", userSchema);

export default User;
