import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;

import com.partisiablockchain.BlockchainAddress;
import com.partisiablockchain.language.abicodegen.Trivia;
import com.partisiablockchain.language.abicodegen.Trivia.GameState;
import com.partisiablockchain.language.abicodegen.Trivia.GameStatusD;
import com.partisiablockchain.language.abicodegen.Trivia.LeaderboardPosition;
import com.partisiablockchain.language.codegenlib.SecretInput;
import com.partisiablockchain.language.junit.ContractBytes;
import com.partisiablockchain.language.junit.ContractTest;
import com.partisiablockchain.language.junit.JunitContractTest;
import com.partisiablockchain.language.junit.exceptions.ActionFailureException;
import com.partisiablockchain.language.junit.exceptions.SecretInputFailureException;
import com.partisiablockchain.language.testenvironment.TxExecution;
import com.partisiablockchain.language.testenvironment.zk.node.task.PendingInputId;

record LeaderboardAndPosition(
        int index,
        Optional<LeaderboardPosition> position
    ) {
        public Optional<LeaderboardPosition> getPosition() {
            return position;
        }
        public int getIndex() {
            return index;
        }
    }

final class TriviaTest extends JunitContractTest {

  private static final ContractBytes TRIVIA_CONTRACT =
    ContractBytes.fromPbcFile(
        Path.of("../rust/target/wasm32-unknown-unknown/release/trivia.pbc"),
        Path.of("../rust/target/wasm32-unknown-unknown/release/trivia_runner")
    );

    private static int MAX_ARR_LENGTH = 20;

    private BlockchainAddress deployer;
    private BlockchainAddress game;

    private BlockchainAddress creator1;
    private BlockchainAddress creator2;

    private BlockchainAddress player1;
    private BlockchainAddress player2;
    private BlockchainAddress player3;

    @ContractTest
    void deploy() {
        deployer = blockchain.newAccount(1);

        creator1 = blockchain.newAccount(2);
        creator2 = blockchain.newAccount(3);

        player1 = blockchain.newAccount(4);
        player2 = blockchain.newAccount(5);
        player3 = blockchain.newAccount(6);


        blockchain.waitForBlockProductionTime(System.currentTimeMillis());

        byte[] initRpc = Trivia.initialize();

        game = blockchain.deployZkContract(deployer, TRIVIA_CONTRACT, initRpc);

        assertNumberOfGames(0);

    }

    @ContractTest(previous = "deploy")
    void testCreateGame() {
        int gameId = 123;
        byte questionCount = 20;
        // Set the deadline to 10 minutes from now (10 * 60 * 1000 milliseconds)
        long gameDeadline = System.currentTimeMillis() + (10 * 60 * 1000);

        createGame(
            creator1,
            gameId,
            questionCount,
            gameDeadline
        );

        assertNumberOfGames(1);
        assertGameIdIsTracked(gameId);

        Optional<GameState> _gameState = getGameState(gameId);

        Assertions.assertThat(_gameState).isPresent();

        GameState gameState = _gameState.get();

        Assertions.assertThat(gameState.creator()).isEqualTo(creator1);
        Assertions.assertThat(gameState.gameStatus().discriminant()).isEqualTo(GameStatusD.IN_PROGRESS);
        Assertions.assertThat(gameState.gameDeadline()).isEqualTo(gameDeadline);
        Assertions.assertThat(gameState.questionCount()).isEqualTo(questionCount);
        Assertions.assertThat(gameState.players().innerMap().size()).isEqualTo(0);
        Assertions.assertThat(gameState.gameDataSvar()).isNotNull();
        Assertions.assertThat(gameState.entriesSvars().size()).isEqualTo(0);
        Assertions.assertThat(gameState.leaderboard().size()).isEqualTo(0);
        
    }

    @ContractTest(previous = "testCreateGame")
    void testCreateGameWithUsedId() {
        int gameId = 123;
        byte questionCount = 20;
        // Set the deadline to 10 minutes from now (10 * 60 * 1000 milliseconds)
        long gameDeadline = System.currentTimeMillis() + (10 * 60 * 1000);

        Assertions.assertThatThrownBy(() -> createGame(
            creator1,
            gameId,
            questionCount,
            gameDeadline
        )).isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("game id already used");
    }

    @ContractTest(previous = "testCreateGame")
    void testCreateGameWithInvalidStartTime() {
        int gameId = 99;
        byte questionCount = 20;
        // Set the deadline to 1 minute ago
        long gameDeadline = System.currentTimeMillis() - (100000 * 60 * 1000);

        Assertions.assertThatThrownBy(() -> createGame(
            creator1,
            gameId,
            questionCount,
            gameDeadline
        )).isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Game end must be in the future");
    }


    @ContractTest(previous = "testCreateGame")
    void testSubmitAnswers() {
        int gameId = 123;

        assertGameIdIsTracked(gameId);

        submitAnswers(
            player1,
            gameId
        );

        Optional<GameState> _gameState = getGameState(gameId);

        Assertions.assertThat(_gameState).isPresent();

        GameState gameState = _gameState.get();

        Assertions.assertThat(gameState.players().innerMap().size()).isEqualTo(1);
        Assertions.assertThat(gameState.players().innerMap().get(player1)).isNotNull();
        Assertions.assertThat(gameState.entriesSvars().size()).isEqualTo(1);
    }

    @ContractTest(previous = "testSubmitAnswers")
    void testSubmitAnswersTwice() {
        int gameId = 123;

        Assertions.assertThatThrownBy(() -> submitAnswers(
            player1,
            gameId
        )).isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Player already submitted");
    }

    @ContractTest(previous = "testSubmitAnswers")
    void testSubmitAnswersAsPlayer2() {
        int gameId = 123;

        assertGameIdIsTracked(gameId);


        List<Byte> answers = new ArrayList<Byte>(Collections.nCopies(MAX_ARR_LENGTH, (byte) 0));

        answers.set(0, (byte) 1); // Q1 answer: 1
        answers.set(1, (byte) 6); // Q2 answer: 2 (incorrect)
        answers.set(2, (byte) 4); // Q3 answer: 3 (incorrect)

        submitAnswers(
            player2,
            gameId,
            answers
        );

        Optional<GameState> _gameState = getGameState(gameId);

        Assertions.assertThat(_gameState).isPresent();

        GameState gameState = _gameState.get();

        Assertions.assertThat(gameState.players().innerMap().size()).isEqualTo(2);
        Assertions.assertThat(gameState.players().innerMap().get(player2)).isNotNull();
        Assertions.assertThat(gameState.entriesSvars().size()).isEqualTo(2);
    }

    @ContractTest(previous = "testSubmitAnswersAsPlayer2")
    void testFinishGameEarly() {
        int gameId = 123;

        assertGameIdIsTracked(gameId);

        Assertions.assertThat(blockchain.getBlockProductionTime()).isLessThan(
            getGameState(gameId).get().gameDeadline()
        );
        Assertions.assertThatThrownBy(() -> finishGame(
            creator1,
            gameId
        )).isInstanceOf(ActionFailureException.class)
        .hasMessageContaining("Deadline limit");
    }

    @ContractTest(previous = "testFinishGameEarly")
    void testFinishGame() {
        int gameId = 123;

        assertGameIdIsTracked(gameId);

        // force time to AFTER the game deadline
        blockchain.waitForBlockProductionTime(getGameState(gameId).get().gameDeadline() + 1);

        Assertions.assertThat(blockchain.getBlockProductionTime()).isGreaterThan(
            getGameState(gameId).get().gameDeadline()
        );

        finishGame(
            creator1,
            gameId
        );

        Optional<GameState> _gameState = getGameState(gameId);

        Assertions.assertThat(_gameState).isPresent();
        // Assertions.assertthat(false).isEqualTo(true);

        GameState gameState = _gameState.get();

        Assertions.assertThat(gameState.gameStatus().discriminant()).isEqualTo(GameStatusD.PUBLISHED);

        Assertions.assertThat(gameState.resultsSvars().size()).isEqualTo(2);
        Assertions.assertThat(gameState.leaderboard().size()).isEqualTo(2);

        Assertions.assertThat(
            getLeaderboardPosition(gameId, player1).getIndex()
        ).isEqualTo(0); // 1st place, index 0
        Assertions.assertThat(
            getLeaderboardPosition(gameId, player2).getIndex()
        ).isEqualTo(1); // 2nd place, index 1
    

        assertLeaderboardPositionScore(gameId, player1, (byte) 3);
        assertLeaderboardPositionScore(gameId, player2, (byte) 1);
    }

    private PendingInputId createGame(BlockchainAddress creator, int id, byte count, long deadline, List<Byte> answers) {
        Trivia.GameInitParams params = new Trivia.GameInitParams(
            id,
            count,
            deadline
        );

        SecretInput input = Trivia.createGame(params).secretInput(answers);

        return blockchain.sendSecretInput(
            game,
            creator,
            input.secretInput(),
            input.publicRpc()
        );
    }
    private PendingInputId createGame(BlockchainAddress creator, int id, byte count, long deadline) {
        List<Byte> answers = new ArrayList<Byte>(Collections.nCopies(MAX_ARR_LENGTH, (byte) 0));

        answers.set(0, (byte) 1); // Q1 answer: 1
        answers.set(1, (byte) 2); // Q2 answer: 2
        answers.set(2, (byte) 3); // Q3 answer: 3

        return createGame(creator, id, count, deadline, answers);
    }

    private PendingInputId submitAnswers(BlockchainAddress player, int id, List<Byte> answers) {
        SecretInput input = Trivia.submitAnswers(id).secretInput(answers);

        return blockchain.sendSecretInput(
            game,
            player,
            input.secretInput(),
            input.publicRpc()
        );
    }
    private PendingInputId submitAnswers(BlockchainAddress player, int id) {
        List<Byte> answers = new ArrayList<Byte>(Collections.nCopies(MAX_ARR_LENGTH, (byte) 0));

        answers.set(0, (byte) 1); // Q1 answer: 1
        answers.set(1, (byte) 2); // Q2 answer: 2
        answers.set(2, (byte) 3); // Q3 answer: 3
        
        return submitAnswers(player, id, answers);
    }

    private TxExecution finishGame(BlockchainAddress creator, int id) {
        byte[] params = Trivia.finishGame(id);

        return blockchain.sendAction(creator, game, params);
    }

    private Trivia.ContractState getContractState() {
        return Trivia.deserializeState(
            blockchain.getContractState(game), 
            getStateClient(),
            game
        );
        // return Trivia.ContractState.deserialize(blockchain.getContractState(game), getStateClient());
    }

    private void assertNumberOfGames(int expectedNumber) {
        Assertions.assertThat(getContractState().games().size()).isEqualTo(expectedNumber);
    }

    private void assertGameIdIsTracked(int gameId) {
        Assertions.assertThat(
            getContractState().gameIds().innerMap().get(gameId)
        ).isNotNull();
    }

    private Optional<GameState> getGameState(int gameId) {
        Trivia.ContractState state = getContractState();
        
        return state.games()
            .stream()
            .filter(game -> game.gameId() == gameId)
            .findFirst();
    }

    

    private LeaderboardAndPosition getLeaderboardPosition(int gameId, BlockchainAddress player) {
        Optional<GameState> state = getGameState(gameId);

        // Fetch the leaderboard and the position on the leaderboard (index)
        
        int index = state.get().leaderboard()
            .stream()
            .map(LeaderboardPosition::player)
            .toList()
            .indexOf(player);

        // Check if the player is in the leaderboard
        if (index == -1) {
            return new LeaderboardAndPosition(-1, Optional.empty());
        }
        // Get the leaderboard position
        LeaderboardPosition pos = state.get().leaderboard().get(index);
        
        // Return
        return new LeaderboardAndPosition(index, Optional.of(pos));
    }
    private void assertLeaderboardPositionScore(int gameId, BlockchainAddress player, byte score) {
        LeaderboardAndPosition pos = getLeaderboardPosition(gameId, player);

        Assertions.assertThat(pos.getPosition()).isPresent();
        Assertions.assertThat(pos.getPosition().get().score()).isEqualTo(score);
    }
    private Optional<LeaderboardPosition> getGameResult(int gameId, BlockchainAddress player) {

        Optional<GameState> gameState = getGameState(gameId);

        return gameState.get().leaderboard()
        .stream()
        .filter(p -> p.player().equals(player))
        .findFirst();
    }
}