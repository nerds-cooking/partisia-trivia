import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"; // ShadCN Dialog components
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // ShadCN RadioGroup
import { useState } from "react";
import { useTheme } from "../providers/theme/useTheme";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setTheme, theme } = useTheme();

  const [clearDataConfirmOpen, setClearDataConfirmOpen] = useState(false);

  // Clear data function (local storage + disconnect)
  const clearData = () => {
    localStorage.clear();
    window.location.replace("/");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Configure your application settings here.
        </DialogDescription>
        <div className="space-y-4 p-1 mb-8">
          {/* Theme Selection Radio Button Group */}
          <div className="space-y-2 mb-8">
            <h3>Theme</h3>
            <RadioGroup className="mt-4" value={theme} onValueChange={setTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Clear Data Button */}
          <div className="mt-8">
            <h3 className="mb-4">Danger zone</h3>
            <Popover
              open={clearDataConfirmOpen}
              onOpenChange={setClearDataConfirmOpen}
            >
              <PopoverTrigger asChild>
                <Button className="w-full" variant="destructive">
                  Clear Data
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-zinc-900 text-white border-zinc-700">
                <h4 className="text-sm font-semibold text-red-500 mb-2">
                  Are you sure?
                </h4>
                <p className="text-sm text-zinc-300 mb-4">
                  This will clear all local data and disconnect your wallet.
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setClearDataConfirmOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      clearData();
                      setClearDataConfirmOpen(false);
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
