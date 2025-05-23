import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Game } from "../providers/game/useGame";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const status = useMemo(() => {
    // TODO: Add logic to determine the status of the game

    return "waiting";
  }, [game]);

  return (
    <Link to={`/games/${game.gameId}`}>
      <Card className="overflow-hidden border-0 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{game.name}</CardTitle>
            <Badge
              variant={
                status === "waiting"
                  ? "outline"
                  : status === "in-progress"
                    ? "secondary"
                    : "default"
              }
              className={`
              ${
                status === "waiting"
                  ? "border-green-400 text-green-400"
                  : status === "in-progress"
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-500"
              }
            `}
            >
              {status === "waiting"
                ? "Waiting"
                : status === "in-progress"
                  ? "In Progress"
                  : "Completed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-white/80">
            Hosted by: {game.onChainGameState.creator}
          </div>
          <div className="flex items-center mt-2 text-sm">
            <Users className="mr-1 h-4 w-4 text-white/70" />
            <span>{game.onChainGameState.players.length} Players</span>
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t border-white/10 flex justify-between">
          <div className="text-xs text-white/60">ID: {game.gameId}</div>
          <div className="flex items-center text-xs text-white/60">
            <Clock className="mr-1 h-3 w-3" />
            <span>Starting soon</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
