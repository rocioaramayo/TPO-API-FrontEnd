import React from "react";
import { useSelector } from 'react-redux';
import CheckoutForm from "../components/CheckoutForm";

const CheckoutPage = () => {
  const cartItems = useSelector(state => state.cart.items);

  return (
    <CheckoutForm 
      cartItems={cartItems}
    />
  );
};

export default CheckoutPage;