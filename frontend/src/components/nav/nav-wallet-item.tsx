import { ellipsisAddress } from "@/lib/utils";
import { usePartisia } from "../providers/partisia/usePartisia";
import { Button } from "../ui/button";

export function NavWalletItem() {
  const { connect, sdk } = usePartisia();

  const buttonStyles =
    "transition-colors px-3 py-2 rounded-md text-sm focus:outline-none";

  // Define explicit default button colors for both states
  const defaultButtonClass = "bg-transparent text-foreground border-border"; // Transparent background, text color based on foreground
  const connectedButtonClass = "bg-transparent text-primary border-primary"; // Default color when connected to wallet

  if (sdk?.isConnected) {
    // Show wallet address and button to connect to different wallet
    return (
      <Button
        variant="secondary"
        className={`${buttonStyles} ${connectedButtonClass} hover:bg-muted hover:text-foreground`}
        onClick={connect}
      >
        {ellipsisAddress(sdk?.connection.account.address)}
      </Button>
    );
  }

  // Show button to connect to wallet
  return (
    <Button
      variant="outline"
      className={`${buttonStyles} ${defaultButtonClass} hover:bg-muted hover:text-foreground`}
      onClick={connect}
    >
      Connect to Wallet
    </Button>
  );
}
