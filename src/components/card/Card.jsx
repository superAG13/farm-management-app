/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
const Card = (props) => {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p>{props.icon}</p>
      <p>
        <button>Add to Cart</button>
      </p>
    </div>
  );
};
export default Card;
