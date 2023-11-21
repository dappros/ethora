import React, { useEffect, useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Box, Button, Container } from "@mui/material"
import { useSnackbar } from "../../context/SnackbarContext"
import { useHistory } from "react-router"
import { LoadingButton } from "@mui/lab"

export interface ISubscriptions {
  clientSecret: string
}

export const Subscriptions: React.FC<ISubscriptions> = ({ clientSecret }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { showSnackbar } = useSnackbar()
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded": {
          // showSnackbar("success", "Success! Payment received.");
          history.push("/")
          break
        }

        case "processing": {
          // showSnackbar( 'error',"Payment processing. We'll update you when payment is received.");
          break
        }

        case "requires_payment_method": {
          // showSnackbar(
          //   "error",
          //   "Payment failed. Please try another payment method."
          // );
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          break
        }

        default: {
          console.log(paymentIntent)
          // showSnackbar("error", "Something went wrong.");
          break
        }
      }
    })
  }, [stripe])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: window.location.origin + "/organizations?payment=success",
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      showSnackbar("error", error.message)
    } else {
      showSnackbar("error", "An unexpected error occurred.")
    }

    setIsLoading(false)
  }
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
        <LoadingButton
          loading={isLoading}
          variant="outlined"
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Box>
    </Container>
  )
}
