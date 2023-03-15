import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, Button, Container } from "@mui/material";
import { useSnackbar } from "../../context/SnackbarContext";
import { useHistory } from "react-router";

export interface ISubscriptions {
  clientSecret: string;
}

export const Subscriptions: React.FC<ISubscriptions> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showSnackbar } = useSnackbar();
  const history = useHistory();
  const handleSubmit = async (event: React.FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          showSnackbar("success", "Success! Payment received.");
          history.push("/");
          break;

        case "processing":
          // showSnackbar( 'error',"Payment processing. We'll update you when payment is received.");
          break;

        case "requires_payment_method":
          showSnackbar(
            "error",
            "Payment failed. Please try another payment method."
          );
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          break;

        default:
          showSnackbar("error", "Something went wrong.");
          break;
      }
    });
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
