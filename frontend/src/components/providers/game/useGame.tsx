import axiosInstance from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface Game {
  _id: string;
  gameId: string;
  name: string;
  description: string;
  category: string;
  questions: Array<{
    question: string;
    answers: Array<{
      answer: string;
    }>;
  }>;
  status: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  creationTxn: string;
}

export function useGame(gameId: string) {
  const [game, setGame] = useState<Game | void>(void 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | void>(void 0);

  const getGame = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(`/api/game/${gameId}`);

      if (resp.status !== 200) {
        throw new Error("Failed to fetch game");
      }

      setGame(resp.data);
    } catch (err: unknown) {
      toast.error("Failed to fetch game");
      console.error("Error fetching game:", err);
      setError((err as Error)?.message || "Failed to fetch game");
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    getGame();
  }, [getGame]);

  return {
    getGame,
    game,
    loading,
    error,
  };
}
