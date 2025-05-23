import { GameCard } from "@/components/cards/GameCard";
import { Game } from "@/components/providers/game/useGame";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function GamesListPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const fetchGames = useCallback(async () => {
    const response = await axiosInstance.get(
      `/api/game?page=${page}&limit=${limit}`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch games");
    }
  }, [limit, page]);

  const query = useQuery<{
    games: Game[];
    totalItems: number;
    totalPages: number;
    page: number;
  }>({
    queryKey: ["games", page, limit],
    queryFn: fetchGames,
  });

  return (
    <div>
      {query.isLoading && <p>Loading...</p>}
      {query.isError && <p>Error: {query.error.message}</p>}
      {query.isSuccess && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {query.data.games.map((game) => (
            <GameCard key={game.gameId} game={game} />
          ))}
        </div>
      )}

      {query.data?.page || 0 > 0 || query.data?.totalPages || 1 > 1 ? (
        <Pagination className="mt-4">
          <PaginationContent>
            <p className="text-sm text-muted-foreground">
              {query.data?.page || 1} / {query.data?.totalPages || 1}
            </p>
            {(query.data?.page || 1) > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>
            )}
            {(query.data?.page || 1) < (query.data?.totalPages || 1) && (
              <PaginationItem>
                <PaginationNext onClick={() => setPage((prev) => prev + 1)}>
                  Next
                </PaginationNext>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
