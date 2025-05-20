import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Award, Gamepad, Menu, Settings } from "lucide-react"; // Importing Icons
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NavWalletItem } from "./nav-wallet-item";
import { SettingsModal } from "./settings-modal";

export function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b border-border bg-background text-foreground">
        <Sheet>
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            {/* Logo as Home Link */}
            <Link to="/" className="text-xl font-semibold">
              🧠
            </Link>

            {/* Desktop Nav - Hidden on mobile */}
            <div className="hidden md:flex flex-1 justify-end mr-4">
              <NavigationMenu>
                <NavigationMenuList className="gap-4 flex items-center">
                  <NavigationMenuItem>
                    <Button
                      asChild
                      variant="ghost"
                      className="hover:text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad className="h-5 w-5" />
                        <Link to="/create-game">Create Game</Link>
                      </div>
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      asChild
                      variant="ghost"
                      className="hover:text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        <Link to="/leaderboard">Leaderboard</Link>
                      </div>
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      className="hover:text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        How to play
                      </div>
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Desktop Right Side: Wallet + Settings */}
            <div className="hidden md:flex items-center gap-2">
              <NavWalletItem />
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-foreground hover:bg-muted"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Wallet Button */}
            <div className="md:hidden flex flex-1 justify-end mr-4">
              <NavWalletItem />
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-4 space-y-4 ml-4 mr-4">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/create-game"
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <Gamepad className="h-5 w-5" /> Create Game
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/leaderboard"
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <Award className="h-5 w-5" /> Leaderboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <SheetTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left">
                        <Settings className="h-5 w-5" /> How to play
                      </button>
                    </SheetTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
                    <Settings className="h-5 w-5" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <SheetContent
            side="right"
            className="bg-background text-foreground p-6"
          >
            <h2 className="text-xl font-semibold mb-4">How to play</h2>
            <p>Some content to explain how to play.</p>
          </SheetContent>
        </Sheet>

        <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      </header>
    </>
  );
}
