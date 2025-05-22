import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { useNavigate } from "react-router-dom";

export function GamesListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const navigate = useNavigate();

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
            gap: 16,
          }}
        >
          {query.data.games.map((game) => (
            <Card key={game.gameId}>
              <CardHeader>
                <CardTitle>{game.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground">
                    {game.description.slice(0, 100)}
                    {game.description.length > 100 ? "..." : ""}
                  </p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p className="text-sm text-muted-foreground">
                    {game.category}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                {+new Date(game.deadline) > +new Date() ? (
                  <Button
                    onClick={() => {
                      navigate(`/games/${game.gameId}`);
                    }}
                  >
                    Join Game
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    onClick={() => {
                      navigate(`/games/${game.gameId}`);
                    }}
                  >
                    View Leaderboard
                  </Button>
                )}
              </CardFooter>
            </Card>
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
