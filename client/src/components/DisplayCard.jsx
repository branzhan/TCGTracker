import React from "react";
import { Link } from "react-router-dom";
import "./DisplayCard.css";

export const DisplayCard = ({ product, set, thumbnailSrc, cardId }) => {
  return (
    <div className="Display-Card-Container">
      <Link to={`/CardPrices/byCardId/CardId?=${cardId}`} className="Card-Link">
        <div className="Thumbnail">
          {" "}
          <img width="25%" src={thumbnailSrc} alt={product} />{" "}
        </div>
        <div>
          <div className="Set"> {set} </div>
          <div className="Product"> {product} </div>
        </div>
      </Link>
    </div>
  );
};
