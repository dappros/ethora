import { Typography } from "@mui/material"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import React, { useEffect, useMemo, useState } from "react"
import { useHistory } from "react-router"
import { FullPageSpinner } from "../../components/FullPageSpinner"
import { config } from "../../config"
import { useSnackbar } from "../../context/SnackbarContext"
import { httpWithAuth } from "../../http"
import { useStoreState } from "../../store"

interface ISecret {
  clientSecret: string
}

export const withStripe = (Component: React.FC<ISecret>) => () => {
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const STRIPE_PUBLISHABLE_KEY = useStoreState(
    (s) => s.config.REACT_APP_STRIPE_PUBLISHABLE_KEY
  )
  const { showSnackbar } = useSnackbar()
  const history = useHistory()
  const stripePromise = useMemo(() => loadStripe(STRIPE_PUBLISHABLE_KEY), [])
  const stripeOptions: StripeElementsOptions = useMemo(
    () => ({ clientSecret: clientSecret, locale: "en" }),
    [clientSecret]
  )

  const getClientSecret = async () => {
    setLoading(true)
    try {
      const res = await httpWithAuth().post("/stripe/subscriptions")
      const secret = res.data.latest_invoice.payment_intent.client_secret
      setClientSecret(secret)
    } catch {
      showSnackbar("error", "Cannot get payment intent")
      history.push("/")
    }
    setLoading(false)
  }
  useEffect(() => {
    getClientSecret()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <FullPageSpinner />
  }
  if (!clientSecret) {
    return (
      <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
        Cannot get payment intent
      </Typography>
    )
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <Component clientSecret={clientSecret} />;
    </Elements>
  )
}
