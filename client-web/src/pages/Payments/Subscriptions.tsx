import React, { useState } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  PaymentElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, Button, Container } from "@mui/material";
import { config } from "../../config";
import { useSnackbar } from "../../context/SnackbarContext";

export interface ISubscriptions {}

export const Subscriptions: React.FC<ISubscriptions> = ({}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showSnackbar } = useSnackbar();
  const handleSubmit = async (event: React.FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: window.location.origin + "/complete",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
      showSnackbar("error", result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <Container maxWidth={"xs"}>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <PaymentElement />
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};
