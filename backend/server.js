const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const env = require("dotenv");
const axios = require("axios");
env.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("requestStockData", async (symbol) => {
        const fetchStockData = async () => {
            try{
                const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
                socket.emit("stockData", {symbol, data:response.data});
            }
            catch(error){
                console.error("Error fetching stock data:", error);
            }
        };
        fetchStockData();
        const interval = setInterval(fetchStockData, 5000);

        socket.on("disconnect", () => {
            clearInterval(interval);
            console.log("User disconnected", socket.id);
        });
    });
});










server.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
})