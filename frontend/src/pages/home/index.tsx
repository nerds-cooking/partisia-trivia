import { GameCard } from "@/components/cards/GameCard";
import { Game } from "@/components/providers/game/useGame";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const [page] = useState(1);
  const [limit] = useState(3);

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
    games: Array<Game>;
    totalItems: number;
    totalPages: number;
    page: number;
    userMap: Record<string, string>;
  }>({
    queryKey: ["games", page, limit],
    queryFn: fetchGames,
  });

  return (
    <div>
      <main>
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg">
            The Ultimate Blockchain Trivia Experience!
          </h2>
          <p className="text-xl mb-8">
            Connect your Parti Wallet, challenge friends, and compete for the
            top spot on our blockchain leaderboard!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              <Link to="/create-game">Create Game</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              <Link to="/games">Join Game</Link>
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-200">
            Featured Games
          </h3>
          {query.isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          )}
          {query.isError && <p>Error: {query.error.message}</p>}
          {query.isSuccess && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {query.data.games.map((game) => (
                <GameCard
                  key={game.gameId}
                  game={game}
                  userMap={query.data.userMap || {}}
                />
              ))}
            </div>
          )}
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-yellow-200">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-yellow-400 text-purple-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle className="text-xl mb-2 text-center">
                  Connect
                </CardTitle>
                <CardDescription className="text-white/80 text-center">
                  Connect with your Parti Wallet extension to get started
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-400 text-purple-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle className="text-xl mb-2 text-center">Play</CardTitle>
                <CardDescription className="text-white/80 text-center">
                  Create or join a game and answer trivia questions
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-400 text-purple-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle className="text-xl mb-2 text-center">Win</CardTitle>
                <CardDescription className="text-white/80 text-center">
                  See your score on the blockchain leaderboard
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
