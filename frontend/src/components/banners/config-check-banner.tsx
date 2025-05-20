import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";
import { usePartisia } from "../providers/partisia/usePartisia";

export function ConfigCheckBanner() {
  const { sdk, isValidContract } = usePartisia();

  if (sdk?.isConnected && isValidContract) return null;

  return (
    <Alert variant="destructive" className="rounded-none border-0">
      <TriangleAlertIcon className="h-5 w-5 text-red-500" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        {!sdk?.isConnected
          ? "You are not connected to your wallet."
          : "No valid contract address is set."}
      </AlertDescription>
    </Alert>
  );
}
