"use client";

import { BingoTile as BingoTileType } from "@/types";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { toggleTile, updateTile } from "./actions";
import cn from "@/utils/tailwind";

interface ComponentProps {
  id: string;
  objective: string;
  completed: boolean;

  isEditMode: boolean;
  setGrid: (grid: BingoTileType[]) => void;
}
export default function BingoTile({
  id,
  objective,
  completed,
  isEditMode,
  setGrid,
}: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [objectiveText, setObjectiveText] = useState(objective);

  async function onTileClick(tile_id: string, completed: boolean) {
    if (isEditMode) return;
    setIsLoading(true);
    const result = await toggleTile(tile_id, completed);
    setGrid(result);
    setIsLoading(false);
  }

  async function onSave() {
    if (objectiveText === objective) return;

    setIsLoading(true);
    const result = await updateTile(id, objectiveText);
    setGrid(result);
    setIsLoading(false);
    setObjectiveText(objectiveText);
  }

  useEffect(() => {
    setObjectiveText(objective);
  }, [objective]);

  return (
    <Dialog.Root open={isEditMode ? undefined : false}>
      <Dialog.Trigger asChild>
        <button
          onClick={() => onTileClick(id, !completed)}
          key={id}
          className={cn(
            "w-full aspect-square relative p-3 border border-zinc-700",
            completed ? "bg-green-600" : ""
          )}
          disabled={isLoading}
        >
          <div className={cn(isLoading ? "opacity-50" : "")}>
            <p className="text-[clamp(10px,3vw,18px)] leading-tight">{objective}</p>
          </div>
          {isLoading && (
            <span className="absolute animate-spin size-10 border-6 top-1/2 left-1/2 rounded-full border-l-zinc-300 border-t-zinc-300 border-zinc-500 -translate-x-1/2 -translate-y-1/2" />
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-zinc-950 opacity-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-zinc-900 p-6">
          <Dialog.Title className="text-xl">Edit Tile</Dialog.Title>
          <Dialog.Description className="text-sm">
            Change the objective of this tile below and click save to update it.
          </Dialog.Description>
          <div className="mt-3 space-y-1.5">
            <textarea
              value={objectiveText}
              onChange={(e) => setObjectiveText(e.target.value)}
              className="w-full h-24 p-2 border border-zinc-700 rounded-md bg-zinc-800 resize-none"
              maxLength={72}
            />
            <div className="flex justify-end">
              <Dialog.Close
                onClick={onSave}
                className="px-4 py-2 bg-blue-600 rounded-xl disabled:opacity-50"
                disabled={objectiveText === objective}
              >
                Save
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
