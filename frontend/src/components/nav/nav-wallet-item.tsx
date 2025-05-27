import { ellipsisAddress } from "@/lib/utils";
import { FingerprintIcon, UnplugIcon, UserCogIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../providers/auth/useAuth";
import { usePartisia } from "../providers/partisia/usePartisia";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function NavWalletItem() {
  const { connect, sdk } = usePartisia();
  const { user, isAuthenticated, login, setUsername } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  const buttonStyles =
    "transition-colors px-3 py-2 rounded-md text-sm focus:outline-none";

  // Define explicit default button colors for both states
  const defaultButtonClass = "bg-transparent text-foreground border-border"; // Transparent background, text color based on foreground
  const connectedButtonClass = "bg-transparent text-primary border-primary"; // Default color when connected to wallet

  if (sdk?.isConnected) {
    if (!isAuthenticated) {
      // Connected but not authenticated, show button to authenticate
      return (
        <Button
          variant="outline"
          className={`${buttonStyles} ${defaultButtonClass} hover:bg-muted hover:text-foreground`}
          onClick={() => {
            login();
          }}
        >
          <FingerprintIcon />
          Login
        </Button>
      );
    }

    // Show wallet address and button to connect to different wallet
    return (
      <>
        <Button
          variant="secondary"
          className={`${buttonStyles} ${connectedButtonClass} hover:bg-muted hover:text-foreground`}
          onClick={connect}
        >
          {user?.username
            ? user.username
            : ellipsisAddress(user?.address || sdk.connection.account.address)}
        </Button>
        {!user?.username && (
          <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost">
                <UserCogIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  setUsername(usernameInput.trim()).then(() => {
                    setModalOpen(false);
                    setUsernameInput("");
                  });
                }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Set a username?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <Input
                      placeholder="Enter your username"
                      value={usernameInput}
                      onChange={(e) => {
                        setUsernameInput(e.target.value);
                      }}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel
                    onClick={() => {
                      setUsernameInput("");
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    disabled={!usernameInput.trim()}
                  >
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  // Show button to connect to wallet
  return (
    <Button
      variant="outline"
      className={`${buttonStyles} ${defaultButtonClass} hover:bg-muted hover:text-foreground`}
      onClick={connect}
    >
      <UnplugIcon />
      Connect to Wallet
    </Button>
  );
}
