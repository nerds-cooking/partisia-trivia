import { Link } from "react-router-dom";
import { NavWalletItem } from "./nav-wallet-item";

export function Navbar() {
  return (
    <>
      <header className="flex justify-between items-center mb-12">
        <Link to="/">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-yellow-300">Trivia</span>
            <span className="text-green-300">Parti</span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavWalletItem />
        </div>
      </header>
    </>
  );
}
