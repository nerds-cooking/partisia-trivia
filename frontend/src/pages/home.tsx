import { usePartisia } from "@/components/providers/partisia/usePartisia";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export function HomePage() {
  const { sdk } = usePartisia();

  const signMessage = useCallback(async () => {}, [sdk]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">Welcome to Partisia Trivia</h1>
      <p className="mt-4 text-gray-600">
        Create and manage trivia games with ease!
      </p>

      <Button onClick={signMessage}>Sign message test</Button>
    </div>
  );
}
