import readline from "readline";
import mongoose from "mongoose";
import Chance from "chance";
import "dotenv/config";

import connectMongoose from "./lib/connectMongoose.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
//import Tag from './models/Tag.js'

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";
import { randomUUID } from "node:crypto";

const chance = new Chance();

//createInterface============================================================
async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // We use a promise to ensure that 'result' always has a value.
  return new Promise((resolve) => {
    rl.question(question, (result) => {
      rl.close();
      resolve(result);
    });
  });
}

//initDB=====================================================================
async function initDB() {
  try {
    // Connecting to MongoDB
    await connectMongoose();

    // Check if the database 'nodepop' exists
    const dbList = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbList.databases.some((db) => db.name === "nodepop");

    if (dbExists) {
      console.log("The 'nodepop' database already exists.");
      const answer = await ask("Do you want to reset the 'users' and 'posts' collections (yes/no): ");
      if (answer.toLowerCase() === "yes") {
        console.log("Resetting the 'users' and 'posts' collections...");

        initCollection(0);
      } else {
        console.log("Process completed without changes.");
        await mongoose.connection.close();
        process.exit(0);
      }
    } else {
      // If the database ‘nodepop’ does not exist, it will be created automatically when inserting data
      console.log("The database ‘nodepop’ does not exist. Creating a new database...");

      initCollection(1);
    }
  } catch (error) {
    console.error("Error initialising the database:", error);
    process.exit(1);
  }
}

//initCollection=============================================================
async function initCollection(value) {
  try {
    await initUsers();
    await initposts();

    // Closing the connection
    await mongoose.connection.close();
    console.log("Closed connection.");
  } catch (error) {
    if (value === 0) {
      console.error("Error resetting collections:", error);
    } else {
      console.error("Error when creating collections:", error);
    }
  }
}

//initUsers==================================================================
async function initUsers() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const avatarSource = path.join(__dirname, "data", "avatar", "default-avatar.png");
  const avatarDestDir = path.join(__dirname, "public", "avatars");

  await fs.mkdir(avatarDestDir, { recursive: true });

  try {
    const avatarFiles = await fs.readdir(avatarDestDir);
    for (const file of avatarFiles) {
      await fs.unlink(path.join(avatarDestDir, file));
    }
    console.log("Cleaned old avatars in public/avatars/");
  } catch (err) {
    console.error("Error cleaning avatars directory:", err);
  }

  const result = await User.deleteMany();
  console.log(`Deleted ${result.deletedCount} users.`);

  const users = [];

  const predefinedUsers = [
    { name: "Admin Datamin", email: "admin@example.com" },
    { name: "Pedro Pereira", email: "user1@example.com" },
  ];

  for (const user of predefinedUsers) {
    const ext = path.extname(avatarSource);
    const avatarFilename = `${Date.now()}-${randomUUID()}${ext}`;
    const avatarDestPath = path.join(avatarDestDir, avatarFilename);

    try {
      await fs.copyFile(avatarSource, avatarDestPath);
      console.log(`Copied default avatar → ${avatarFilename}`);
    } catch (err) {
      console.error(`Error copying default avatar:`, err);
      continue;
    }

    users.push({
      name: user.name,
      email: user.email,
      password: await User.hashPassword("1234"),
      avatar: avatarFilename,
    });
  }

  const insertResult = await User.insertMany(users);
  console.log(`Inserted ${insertResult.length} users.`);
}
//initposts===============================================================
async function initposts() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const photoSource = path.join(__dirname, "data", "images");
  const photoDestDir = path.join(__dirname, "public", "photos");

  /* const photoSource = path.join(import.meta.url, "data", "images");
  const photoDestDir = path.join(import.meta.url, "public", "photos"); */

  await fs.mkdir(photoDestDir, { recursive: true });

  try {
    const files = await fs.readdir(photoDestDir);
    for (const file of files) {
      await fs.unlink(path.join(photoDestDir, file));
    }
    console.log("Cleaned old photos in public/photos/");
  } catch (err) {
    console.error("Error cleaning photos directory:", err);
  }

  const user1 = await User.findOne({ email: "user1@example.com" });

  const result = await Post.deleteMany();
  console.log(`Deleted ${result.deletedCount} posts.`);

  const postTemplates = [
    { name: "CellPhone", price: 20000, photo: "cellphone.jpg", tag: "mobile" },
    { name: "Chair", price: 30000, photo: "chair.jpg", tag: "lifestyle" },
    { name: "Drawer", price: chance.integer({ min: 1, max: 999999 }), photo: "drawer.jpg", tag: "lifestyle" },
    { name: "Electric Saw", price: chance.integer({ min: 1, max: 999999 }), photo: "electric_saw.jpg", tag: "motor" },
    { name: "Monitor", price: chance.integer({ min: 1, max: 999999 }), photo: "monitor.jpg", tag: "work" },
    { name: "Table", price: chance.integer({ min: 1, max: 999999 }), photo: "table.jpg", tag: "lifestyle" },
  ];

  const postsToInsert = [];

  //Rename post Images amd Push-----------------------------
  for (const template of postTemplates) {
    const srcPath = path.join(photoSource, template.photo);

    const timestamp = Date.now();
    const id = randomUUID();
    const ext = path.extname(template.photo);
    const newFileName = `${timestamp}-${id}${ext}`;
    const destPath = path.join(photoDestDir, newFileName);

    try {
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied ${template.photo} → ${newFileName}`);
    } catch (err) {
      console.error(`Error copying ${template.photo}:`, err);
      continue;
    }
    postsToInsert.push({
      name: template.name,
      price: template.price,
      photo: newFileName,
      tag: template.tag,
      owner: user1._id,
    });
  }
  //-----------------------------------------------------------

  const insertResult = await Post.insertMany(postsToInsert);
  console.log(`Inserted ${insertResult.length} posts.`);
}

initDB();
