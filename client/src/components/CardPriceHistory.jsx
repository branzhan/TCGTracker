import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";

const CardPriceHistory = () => {
  const { cardId } = useParams(); // Extract cardId from the URL
  const [priceHistory, setPriceHistory] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/CardPrices/byCardId/?CardId=${cardId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data with status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log(data)

        // Create a combined array of objects
        const combinedData = data.map((price) => ({
          date: new Date(price.date).toLocaleDateString(),
          marketPrice: price.marketPrice
        }));

        // Filter out entries with NaN market prices
        const filteredData = combinedData.filter(
          (item) => !isNaN(item.marketPrice),
        );
        // Extract dates and market prices
        const dates = filteredData.map((item) => item.date);
        const marketPrices = filteredData.map((item) => item.marketPrice);

        console.log(dates)
        console.log(marketPrices)

        setChartData({
          labels: dates,
          datasets: [
            {
              label: "Market Price",
              data: marketPrices,
              borderColor: "rgba(255, 99, 132, 1)",
              fill: false,
            }
          ],
        });
      } catch (error) {
        console.error("Failed to fetch card price history:", error);
      }
    };

    fetchPriceHistory();
  }, [cardId]);

  return (
    <div>
      <h2>Price History for Card ID: {cardId}</h2>
      <Line data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default CardPriceHistory;
