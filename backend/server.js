const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")
// Handling Uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Uncaught exception");

    process.exit(1);
})
// Config
dotenv.config({path: "backend/config/config.env"})

// Connecting to database;
connectDatabase();




const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

// console.log(youtube)




// This Happend when mongodb url was disturbed
// Unhandled promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled promise Rejection");

    server.close(() => {
        process.exit(1);
    })
})