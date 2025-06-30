import React from 'react';
import '../../styles/PriceDisplay.css'; 

const PriceDisplay = ({ regularPrice, offerPrice }) => {
  const hasOffer = offerPrice != null && offerPrice < regularPrice;

  return (
    <div className="price-display">
      {hasOffer && (
        <span className="old-price">
          S/. {parseFloat(regularPrice).toFixed(2)}
        </span>
      )}
      <span className="current-price">
        S/. {parseFloat(hasOffer ? offerPrice : regularPrice).toFixed(2)}
      </span>
    </div>
  );
};

export default PriceDisplay;