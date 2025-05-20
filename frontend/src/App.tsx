import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/nav";
import { CreateGamePage } from "./pages/create-game";
import { GameViewPage } from "./pages/game/game-view";
import { HomePage } from "./pages/home";

function Layout({
  children,
  maxWidth = 1200,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-4">
      <Navbar />
      <div className={`mx-auto max-w-[${maxWidth}px] px-4`}>
        <div className="py-8">{children}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/create-game"
          element={
            <Layout maxWidth={800}>
              <CreateGamePage />
            </Layout>
          }
        />
        <Route
          path="/games/:gameId"
          element={
            <Layout maxWidth={800}>
              <GameViewPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
