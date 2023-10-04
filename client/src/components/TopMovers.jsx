import React, { useEffect, useState } from "react";
import axios from "axios";

function TopMovers() {
  const [cardChanges, setCardChanges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios
          .get("http://localhost:5000/CardPrices/price_difference/daily")
          .then(function (response) {
            setCardChanges(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Top Movers of All Time</h2>
      <CardInfo cards={cardChanges}></CardInfo>
    </div>
  );
}

const CardInfo = (props) => {
  const listItems = props.cards.map((card) => {
    return (<li>
      <div>
        <h3>{card.product}</h3>
      </div>
    </li>);
  });

  return <ul>{listItems}</ul>;
};

export default TopMovers;
