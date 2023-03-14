import { Subscriptions } from "./Subscriptions";
import { withStripe } from "./withStripe";

const Subscription = withStripe(Subscriptions);
export default Subscription;