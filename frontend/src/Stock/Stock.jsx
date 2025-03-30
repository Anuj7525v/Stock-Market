import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
//import "./index.css";


const socket = io("https://stock-market-t563.onrender.com");

function Stock() {
    const [stockSymbol, setStockSymbol] = useState("AAPL");
    const [stockData, setStockData] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        socket.emit("requestStockData", stockSymbol);
        socket.on("stockData", (data) => {
            if(data.symbol === stockSymbol){
                setStockData(data.data);
                setHistory((prev) => [...prev.slice(-9),data.data.c]);
            } 
        });
        return () => {
            socket.off("stockData")
        };
    },[stockSymbol]);





    return (
        <div className='flex flex col items-center justify-center h-screen bg-gray-100'>
            <h2 className='text-xl font-bold mb-4'>Real Time Stock Market</h2>
            <select className='p-2 border rounded mb-4' onChange={(e) => setStockSymbol(e.target.value)}
                value={stockSymbol}>
                <option value="AAPL"> Apple (AAPL)</option>
                <option value="GOOGL"> Google(GOOGL)</option>
                <option value="TSLA"> Tesla(TSLA)</option>
                <option value="AMZN"> Amazon(AMZN)</option>
            </select>
            <div className="p-6 bg-white shadow-lg rounded-lg w-80 text-center">
                <h3 className="text-lg font-bold">{stockSymbol} Stock Price</h3>
                {stockData ? (
                    <div className="mt-4">
                        <p>Current Price: ${stockData.c}</p>
                        <p>High : ${stockData.h} </p>
                        <p>Low : ${stockData.l} </p>
                    </div>

                ) : (
                    <p> Loading... </p>
                )}
            </div>
            <div className="w-full max-w-md mt-6">
                <Line
                    data={{
                        labels: history.map((_, index) => index + 1),
                        datasets: [
                            {
                                label: `${stockSymbol} Price`,
                                data: history,
                                borderColor: "#3b82f6",
                                fill: false,
                            },
                       
                        ],
                    }}
                    />
                
            </div>

        </div>
    )
}

export default Stock;
