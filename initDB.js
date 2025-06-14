/* eslint-disable no-undef */
import readline from "readline";
import mongoose from "mongoose";
import Chance from "chance";

import connectMongoose from "./lib/connectMongoose.js";

import User from "./models/User.js";
import Product from "./models/Product.js";
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
      const answer = await ask(
        "Do you want to reset the 'users' and 'products' collections (yes/no): "
      );
      if (answer.toLowerCase() === "yes") {
        console.log("Resetting the 'users' and 'products' collections...");

        initCollection(0);
      } else {
        console.log("Process completed without changes.");
        await mongoose.connection.close();
        process.exit(0);
      }
    } else {
      // If the database ‘nodepop’ does not exist, it will be created automatically when inserting data
      console.log(
        "The database ‘nodepop’ does not exist. Creating a new database..."
      );

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
    await initProducts();

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

  const avatarSource = path.join(
    __dirname,
    "data",
    "avatar",
    "default-avatar.png"
  );
  const avatarDestDir = path.join(__dirname, "public", "avatars");

  await fs.mkdir(avatarDestDir, { recursive: true });

  const result = await User.deleteMany();
  console.log(`Deleted ${result.deletedCount} users.`);

  const usersToInsert = [];

  for (let i = 1; i <= 6; i++) {
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

    usersToInsert.push({
      name: chance.name(),
      email: `user_n_${i}@gmail.com`,
      password: await User.hashPassword("1234"),
      avatar: avatarFilename,
    });
  }

  const insertResult = await User.insertMany(usersToInsert);
  console.log(`Inserted ${insertResult.length} users.`);

  return result;
}

//initProducts===============================================================
async function initProducts() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const sourceDir = path.join(__dirname, "data", "images");
  const destDir = path.join(__dirname, "public", "photos");

  await fs.mkdir(destDir, { recursive: true });

  const users = await User.find();

  const result = await Product.deleteMany();
  console.log(`Deleted ${result.deletedCount} products.`);

  const productTemplates = [
    {
      name: "CellPhone",
      price: 20000,
      photo: "cellphone.jpg",
      owner: users[0]._id,
    },
    { name: "Chair", price: 30000, photo: "chair.jpg", owner: users[1]._id },
    {
      name: "Drawer",
      price: chance.integer({ min: 1, max: 999999 }),
      photo: "drawer.jpg",
      owner: users[2]._id,
    },
    {
      name: "Electric Saw",
      price: chance.integer({ min: 1, max: 999999 }),
      photo: "electric_saw.jpg",
      owner: users[3]._id,
    },
    {
      name: "Monitor",
      price: chance.integer({ min: 1, max: 999999 }),
      photo: "monitor.jpg",
      owner: users[4]._id,
    },
    {
      name: "Table",
      price: chance.integer({ min: 1, max: 999999 }),
      photo: "table.jpg",
      owner: users[5]._id,
    },
  ];

  const productsToInsert = [];

  for (const template of productTemplates) {
    const srcPath = path.join(sourceDir, template.photo);

    const timestamp = Date.now();
    const id = randomUUID();
    const ext = path.extname(template.photo);
    const newFileName = `${timestamp}-${id}${ext}`;
    const destPath = path.join(destDir, newFileName);

    try {
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied ${template.photo} → ${newFileName}`);
    } catch (err) {
      console.error(`Error copying ${template.photo}:`, err);
      continue; // skip this product
    }

    productsToInsert.push({
      name: template.name,
      price: template.price,
      photo: newFileName, // Save new name
      owner: template.owner,
    });
  }

  const insertResult = await Product.insertMany(productsToInsert);
  console.log(`Inserted ${insertResult.length} products.`);
}

initDB();
