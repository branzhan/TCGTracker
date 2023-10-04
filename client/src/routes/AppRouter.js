import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchCard from '../components/SearchCard';
import CardPriceHistory from '../components/CardPriceHistory';
import TopMovers from '../components/TopMovers';
import HomePage from '../components/Homepage';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the initial page with search */}
        <Route path="/" element={<HomePage />} />

        {/* Route for displaying card price history */}
        <Route path="/CardPrices/byCardId/" element={<CardPriceHistory />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
