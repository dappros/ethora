import * as React from "react";
import { useSubscription } from "@apollo/client";
import { TRRANSFER_TO_SUBSCRIPTION } from "../apollo/subscription";
import { useStoreState } from "../store";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type Props = {};

function Subscription({}: Props) {
  const [open, setOpen] = React.useState(false);
  const user = useStoreState((state) => state.user);
  const dptBalance = useStoreState((state) =>
    state.balance.find((el) => el.tokenName === "Dappros Platform Token")
  );
  const { data, loading } = useSubscription(TRRANSFER_TO_SUBSCRIPTION, {
    variables: {
      walletAddress: user.walletAddress,
      contractAddress: dptBalance.contractAddress,
    },
  });

  React.useEffect(() => {
    if (data) {
      setOpen(true);
      console.log(data);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }, [data, loading]);

  return (
    <div>
      {open && (
        <Snackbar
          open={true}
          message={`You get coins ${data.transferTo.amount}`}
        />
      )}
      ;
    </div>
  );
}

export default Subscription;
