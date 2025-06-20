import React from "react";
import CheckoutForm from "../components/CheckoutForm";

const CheckoutPage = ({ cartItems, setCartItems }) => {
  return (
    <CheckoutForm 
      cartItems={cartItems}
      setCartItems={setCartItems}
    />
  );
};

export default CheckoutPage;