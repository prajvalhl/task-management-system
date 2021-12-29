import React from "react";
import { BounceLoader } from "react-spinners";

function Spinner({ isLoading }) {
  const spinnerStyle = {
    position: "fixed",
    top: "50%",
    left: "46%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={spinnerStyle}>
      <BounceLoader loading={isLoading} color="#2196f3" />
    </div>
  );
}

export default Spinner;
