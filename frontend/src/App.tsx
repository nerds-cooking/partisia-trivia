import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/nav";
import { CreateGamePage } from "./pages/create-game";
import { GameViewPage } from "./pages/game/game-view";
import { GamesListPage } from "./pages/games";
import { HomePage } from "./pages/home";

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesListPage />} />
          <Route path="/create-game" element={<CreateGamePage />} />
          <Route path="/games/:gameId" element={<GameViewPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
