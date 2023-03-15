import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { httpWithAuth } from '../../http'

export function Billing() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Create Payment Method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log({ paymentMethod })

    const subscription: Record<string, any> = await httpWithAuth().post("/stripe/subsriptions", {
      paymentMethodId: paymentMethod.id
    })

    console.log('subscription from server ', subscription)

    if (subscription.data.latest_invoice.payment_intent) {
      const { client_secret, status } = subscription.data.latest_invoice.payment_intent;

      if (status === 'requires_action') {
        const { error: confirmationError } = await stripe.confirmCardPayment(
          client_secret
        );
        if (confirmationError) {
          console.error(confirmationError);
          alert('unable to confirm card');
          return;
        }
      }

      // success
      alert('You are subscribed!');
    }
  };


  return (
    <div>
      <div>Billing</div>
      <div>
        <form onSubmit={handleSubmit} className="well">
            <div style={{width: "600px"}}>
              <CardElement />
            </div>
            <button className="btn btn-success" type="submit">
              Subscribe & Pay
            </button>
          </form>
      </div>
    </div>
  )
}