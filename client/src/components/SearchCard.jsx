import React, { useState } from "react";
import "./SearchCard.css";
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "../hooks/debounceHook";
import { DisplayCard } from "./DisplayCard";

const SearchCard = () => {
  const [product, setProduct] = useState("");
  const [cards, setCards] = useState([]);

  const changeHandler = (e) => {
    e.preventDefault();
    const inputValue = e.target.value;
    setProduct(inputValue);

    if (!inputValue || inputValue.trim() === "") {
      // Clear the cards when the search input is empty
      setCards([]);
    }
  };

  const searchProduct = async () => {
    if (!product || product.trim() === "") {
      return; // Don't make a request if the search input is empty
    }

    const response = await fetch(
      `http://localhost:5000/Cards/byProduct/?product=${product}`
    );

    if (response) {
      const parseResponse = await response.json();
      console.log(parseResponse);
      setCards(parseResponse.slice(0, 10));
    }
  };

  useDebounce(product, 500, searchProduct);

  return (
    <div className="Search-Bar-Container">
      <div className="Search-Input-Container">
        <span className="Search-Icon">
          <IoSearch />
        </span>
        <input
          type="text"
          className="Search-Input"
          placeholder="Search for a Card..."
          onChange={changeHandler}
          value={product}
        />
      </div>
      {cards.map((card) => {
        return (
          <div key={card.id}>
            <DisplayCard
              thumbnailSrc={card.url}
              product={card.product}
              set={card.set}
              cardId={card.id} // Pass the card's ID as a prop
            />
          </div>
        );
      })}
    </div>
  );
};

export default SearchCard;
