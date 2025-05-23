import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/nav";

const HomePage = lazy(() =>
  import("./pages/home").then((mod) => ({ default: mod.HomePage }))
);
const GamesListPage = lazy(() =>
  import("./pages/games").then((mod) => ({ default: mod.GamesListPage }))
);
const CreateGamePage = lazy(() =>
  import("./pages/create-game").then((mod) => ({ default: mod.CreateGamePage }))
);
const GameViewPage = lazy(() =>
  import("./pages/game/game-view").then((mod) => ({
    default: mod.GameViewPage,
  }))
);

function Layout({
  children,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 py-8">
        <Navbar />

        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesListPage />} />
            <Route path="/create-game" element={<CreateGamePage />} />
            <Route path="/games/:gameId" element={<GameViewPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
