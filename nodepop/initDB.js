import readline from 'readline';
import mongoose from 'mongoose';
import connectMongoose from './lib/connectMongoose.js'
import Chance from 'chance';

//Import models
import User from './models/User.js'
import Product from './models/Product.js'
//import Tag from './models/Tag.js'

const chance = new Chance();

//createInterface============================================================
async function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Usamos una promesa para asegurarnos de que 'result' siempre tiene un valor
    return new Promise((resolve, reject) => {
        rl.question(question, (result) => {
            rl.close();
            resolve(result);
        });
    });
}

//initDB=====================================================================
async function initDB() {

    try {
        // Conectar a MongoDB
        const connection = await connectMongoose();

        // Comprobar si la base de datos 'nodepop' existe
        const dbList = await mongoose.connection.db.admin().listDatabases();
        const dbExists = dbList.databases.some(db => db.name === 'nodepop');

        if (dbExists) {
            console.log("La base de datos 'nodepop' ya existe.");
            const answer = await ask("¿Quieres resetear las colecciones 'users' y 'products'? (yes/no): ")
            if (answer.toLowerCase() === 'yes') {
                console.log("Reseteando las colecciones 'users' y 'products'...");

                initCollection(0);

            } else {
                console.log("Proceso terminado sin cambios.");
                await mongoose.connection.close();
                rl.close();
                process.exit(0);
            }
        } else {
            // Si la base de datos 'nodepop' no existe, se creará automáticamente al insertar datos
            console.log("La base de datos 'nodepop' no existe. Creando una nueva base de datos...");

            initCollection(1);
        }
    } catch (error) {
        console.error("Error inicializando la base de datos:", error);
        process.exit(1);
    }
}

//initCollection=============================================================
async function initCollection(value) {
    try {

        await initUsers();
        await initProducts();

        // Cerrar la conexión
        await mongoose.connection.close();
        console.log("Conexión cerrada.");

    } catch (error) {
        if (value === 0) {
            console.error("Error al resetear colecciones:", error);
        } else {
            console.error("Error al crear colecciones:", error);
        }
    }
}

//initUsers==================================================================
async function initUsers() {

    // delete all users
    const result = await User.deleteMany()
    console.log(`Deleted ${result.deletedCount} users.`)

    // create users
    const insertResult = await User.insertMany([
        { name: chance.name(), email: chance.email(), password: await User.hashPassword('1234') },
        { name: chance.name(), email: chance.email(), password: await User.hashPassword('1234') },
        { name: chance.name(), email: chance.email(), password: await User.hashPassword('1234') },
        { name: chance.name(), email: chance.email(), password: await User.hashPassword('1234') },
        { name: chance.name(), email: chance.email(), password: await User.hashPassword('1234') },
        { name: chance.name(), email: chance.email(), password: await User.hashPassword('1234') },
    ])

    console.log(`Inserted ${insertResult.length} users.`)

    //retorna los usuarios creados
    return result;
}

async function initProducts() {

    // Buscar usuarios existentes
    const users = await User.find();

    // delete all products
    const result = await Product.deleteMany()
    console.log(`Deleted ${result.deletedCount} products.`)

    // create products
    const insertResult = await Product.insertMany([
        //{ name: chance.animal(), price: chance.integer({ min: 1, max: 999999 }), photo: '/public/images/cellphone.jpg', owner: users[0]._id }, (X)
        { name: chance.animal(), price: chance.integer({ min: 1, max: 999999 }), photo: 'cellphone.jpg', owner: users[0]._id },
        { name: chance.animal(), price: chance.integer({ min: 1, max: 999999 }), photo: 'chair.jpg', owner: users[1]._id },
        { name: chance.animal(), price: chance.integer({ min: 1, max: 999999 }), photo: 'drawer.jpg', owner: users[2]._id },
        { name: chance.animal(), price: chance.integer({ min: 1, max: 999999 }), photo: 'electric_saw.jpg', owner: users[3]._id },
        { name: chance.animal(), price: chance.integer({ min: 1, max: 999999 }), photo: 'monitor.jpg', owner: users[4]._id },
        { name: chance.animal(), price: chance.integer({ min: 1, max: 999999 }), photo: 'table.jpg', owner: users[5]._id },
    ]);
    console.log(`Inserted ${insertResult.length} products.`)

}

initDB();