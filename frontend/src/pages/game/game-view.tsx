import { useGame } from "@/components/providers/game/useGame";
import { usePartisia } from "@/components/providers/partisia/usePartisia";
import { useSettings } from "@/components/providers/setting/useSettings";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { TriviaApi } from "@/lib/TriviaApi";
import {
  BlockchainAddress,
  BlockchainTransactionClient,
} from "@partisiablockchain/blockchain-api-transaction-client";
import { Client, RealZkClient } from "@partisiablockchain/zk-client";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AnswersSummary } from "./AnswersSummary";
import { QuestionView } from "./QuestionView";

export function GameViewPage() {
  const gameId = useParams<{ gameId: string }>().gameId;

  const { game, loading, error } = useGame(gameId || "0");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(20).fill(-1));

  const { settings } = useSettings();
  const { sdk } = usePartisia();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [s, setS] = useState<any>();

  useEffect(() => {
    const currentAccount = sdk?.connection.account;

    if (!currentAccount) {
      return;
    }

    // if (!currentAccount?.address) {
    //   toast.error("No account connected");
    //   return;
    // }

    const contractAddress = settings?.find(
      (s) => s.name === "contractAddress"
    )?.value;
    if (!contractAddress) {
      toast.error("Contract address not found");
      return;
    }

    const partisiaClientUrl = settings?.find(
      (s) => s.name === "partisiaClientUrl"
    )?.value;
    if (!partisiaClientUrl) {
      toast.error("Partisia client URL not found");
      return;
    }

    const client = new Client(partisiaClientUrl);
    const transactionClient = BlockchainTransactionClient.create(
      partisiaClientUrl,
      {
        getAddress: () => currentAccount!.address as BlockchainAddress,
        sign: async (payload: Buffer) => {
          const res = await sdk!.signMessage({
            payload: payload.toString("hex"),
            payloadType: "hex",
            dontBroadcast: true,
          });
          return res.signature;
        },
      }
    );
    const zkClient = RealZkClient.create(contractAddress, client);
    const triviaApi = new TriviaApi(
      transactionClient,
      zkClient,
      currentAccount!.address
    );

    axiosInstance
      .get(`/api/game/state`)
      .then((state) => {
        console.log("State:", state);
        setS(state);
      })
      .catch((err) => {
        console.error("Error getting state:", err);
        toast.error("Failed to get state");
      });
  }, [sdk, settings]);

  const onSubmit = useCallback(async () => {
    if (!game) {
      return;
    }

    setIsSubmitting(true);

    try {
      const currentAccount = sdk?.connection.account;

      const contractAddress = settings?.find(
        (s) => s.name === "contractAddress"
      )?.value;
      if (!contractAddress) {
        toast.error("Contract address not found");
        return;
      }

      const partisiaClientUrl = settings?.find(
        (s) => s.name === "partisiaClientUrl"
      )?.value;
      if (!partisiaClientUrl) {
        toast.error("Partisia client URL not found");
        return;
      }

      const client = new Client(partisiaClientUrl);
      const transactionClient = BlockchainTransactionClient.create(
        partisiaClientUrl,
        {
          getAddress: () => currentAccount!.address as BlockchainAddress,
          sign: async (payload: Buffer) => {
            const res = await sdk!.signMessage({
              payload: payload.toString("hex"),
              payloadType: "hex",
              dontBroadcast: true,
            });
            return res.signature;
          },
        }
      );
      const zkClient = RealZkClient.create(contractAddress, client);
      const triviaApi = new TriviaApi(
        transactionClient,
        zkClient,
        currentAccount!.address
      );

      const answersArr = new Array(20);
      for (let i = 0; i < game?.questions.length; i++) {
        answersArr[i] = answers[i] + 1;
      }

      console.log({
        gameId,
        answersArr,
      });

      const txn = await triviaApi.submitAnswers(Number(gameId), answersArr);

      console.log(txn);

      toast.success("Answers submitted!");

      //   navigate(`/games/${state.gameId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create game");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, game, gameId, sdk, settings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Game not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl/7 mb-6 pt-1">{game?.name}</h1>
      <p className="mt-4 text-lg">{game?.description}</p>
      <p className="mt-2 text-sm text-gray-500">Category: {game?.category}</p>
      <p className="mt-2 text-sm text-gray-500">
        Created At: {new Date(game?.createdAt).toLocaleString()}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Deadline: {new Date(game?.deadline).toLocaleString()}
      </p>
      <div className="mt-8 w-full max-w-md">
        <div>
          {activeQuestionIdx === game?.questions.length ? (
            <AnswersSummary game={game} answers={answers} />
          ) : (
            <QuestionView
              question={game?.questions[activeQuestionIdx]}
              index={activeQuestionIdx}
              setAnswers={setAnswers}
              answers={answers}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            gap: "8px",
          }}
        >
          <Button
            variant="outline"
            className="w-1/3"
            disabled={activeQuestionIdx === 0}
            onClick={() => setActiveQuestionIdx((prev) => prev - 1)}
          >
            Previous
          </Button>
          {activeQuestionIdx !== game?.questions.length && (
            <p className="text-sm text-gray-500">
              {activeQuestionIdx + 1} / {game?.questions.length}
            </p>
          )}
          <Button
            variant="default"
            className="w-1/3"
            onClick={() => {
              if (activeQuestionIdx === game?.questions.length) {
                onSubmit();
                return;
              }
              // Check if the answer is selected
              if (answers[activeQuestionIdx] === -1) {
                toast.error("Please select an answer");
                return;
              }
              // Move to the next question
              setActiveQuestionIdx((prev) => prev + 1);
            }}
          >
            {activeQuestionIdx === game?.questions.length ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
