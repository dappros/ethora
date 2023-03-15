import { Typography } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { FullPageSpinner } from "../../components/FullPageSpinner";
import { config } from "../../config";
import { useSnackbar } from "../../context/SnackbarContext";
import { httpWithAuth } from "../../http";

export const withStripe = (Component: React.ComponentType) => () => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();
  const history = useHistory();
  const stripePromise = useMemo(
    () => loadStripe(config.STRIPE_PUBLISHABLE_KEY),
    []
  );
  const stripeOptions = useMemo(
    () => ({ clientSecret: clientSecret }),
    [clientSecret]
  );

  const getClientSecret = async () => {
    setLoading(true);
    try {
      const res = await httpWithAuth().get("/create-checkout-intent");
      setClientSecret(res.data.client_secret);
    } catch (error) {
      showSnackbar("error", "Cannot get payment intent");
      history.push("/");
    }
    setLoading(false);
  };
  useEffect(() => {
    getClientSecret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }
  if (!clientSecret) {
    return (
      <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
        Cannot get payment intent
      </Typography>
    );
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <Component />;
    </Elements>
  );
};
