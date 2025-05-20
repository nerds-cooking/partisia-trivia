import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [limit, setLimit] = useState(10);

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
    games: Array<{
      _id: string;
      gameId: string;
      name: string;
      description: string;
      category: string;
      status: string;
      createdAt: string;
      deadline: string;
    }>;
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
            gap: "16px",
          }}
        >
          <div>
            {query.data.games.map((game) => (
              <Card key={game.gameId}>
                <CardHeader>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>
                    {game.description.slice(0, 100)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Category: {game.category}</p>
                  <p>Status: {game.status}</p>
                  <p>Created At: {new Date(game.createdAt).toLocaleString()}</p>
                  <p>Deadline: {new Date(game.deadline).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </PaginationPrevious>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext onClick={() => setPage((prev) => prev + 1)}>
              Next
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
