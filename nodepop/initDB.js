import readline from 'readline';
import mongoose from 'mongoose';
import connectMongoose from './lib/connectMongoose.js'

//Import models
import User from './models/User.js'
import Product from './models/Product.js'
//import Tag from './models/Tag.js'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function initDB() {
    try {
        // Connect to MongoDB
        const connection = await connectMongoose();

        // Ask if user wants to delete the database if it exists
        rl.question("The 'nodepop' database already exists. Do you want to delete it? (yes/no): ", async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log("Deleting the 'nodepop' database...");
                await mongoose.connection.dropDatabase();
                console.log("'nodepop' database deleted.");
                console.log("Creating a new 'nodepop' database...");
                await insertData();
            } else {
                console.log("Process terminated without changes.");
                await mongoose.connection.close();
                process.exit(0);
            }
            rl.close();
        });
    } catch (error) {
        console.error("Error initializing the database:", error);
        process.exit(1);
    }
}

async function insertData() {
    try {
        
        const insertUsers = await User.insertMany([
            { name: 'Juan Pérez', email: 'juan@example.com', password: '123456' },
            { name: 'Ana López', email: 'ana@example.com', password: 'password123' }
        ]);

        const insertProducts = await Product.insertMany([
            { name: 'GG', price: 12000, url: 'miUrl/1234',state:'IDK' },
            { name: 'FF', price: 24000, url: 'miUrl/5678',state:'IDK2' },
        ]); 
        
        console.log("Inserted data:", { insertUsers, insertProducts });

        // Close connection
        await mongoose.connection.close();
        console.log("Connection closed.");
    } catch (error) {
        console.error("Error inserting data into the database:", error);
        process.exit(1);
    }
}
initDB();


/* const connection = await connectMongoose()
console.log('Connected to MongoDB:', connection.name)

const answer = await ask('Are you sure you want to delete database collections? (n)')
if (answer.toLowerCase() !== 'y') {
  console.log('Operation aborted.')
  process.exit()
}

await initAgents()
await initUsers()

await connection.close()

async function initAgents() {
  // delete all agents
  const result = await Agent.deleteMany()
  console.log(`Deleted ${result.deletedCount} agents.`)

  // create agents
  const insertResult = await Agent.insertMany([
    { name: 'Smith', age: 45 },
    { name: 'Brown', age: 33 },
    { name: 'Jones', age: 24 },
  ])
  console.log(`Inserted ${insertResult.length} agents.`)
}

async function initUsers() {
  // delete all users
  const result = await User.deleteMany()
  console.log(`Deleted ${result.deletedCount} users.`)

  // create users
  const insertResult = await User.insertMany([
    { email: 'admin@example.com', password: await User.hashPassword('1234') },
    { email: 'user@example.com', password: await User.hashPassword('1234') },
  ])
  console.log(`Inserted ${insertResult.length} users.`)
}

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const result = await rl.question(question)
  rl.close()
  return result
} */