import React from "react";
import CheckoutForm from "../components/CheckoutForm";

const CheckoutPage = ({ cartItems, setCartItems, user }) => {
  return (
    <CheckoutForm 
      cartItems={cartItems}
      setCartItems={setCartItems}
      user={user}
    />
  );
};

export default CheckoutPage;