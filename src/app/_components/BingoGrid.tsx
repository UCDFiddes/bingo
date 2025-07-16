"use client";

import { BingoTile } from "@/types";
import cn from "@/utils/tailwind";
import { toggleTile } from "./actions";
import { useState } from "react";

interface ComponentProps {
  initalGrid: BingoTile[];
}
export default function BingoGrid({ initalGrid }: ComponentProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [grid, setGrid] = useState<BingoTile[]>(initalGrid);
  const [loadingTile, setLoadingTile] = useState<string | null>(null);

  async function onTileClick(tile_id: string, completed: boolean) {
    setLoadingTile(tile_id);
    const result = await toggleTile(tile_id, completed);
    setGrid(result);
    setLoadingTile(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-3 w-full">
      <div className="flex items-center justify-center mb-3 gap-3">
        <div
          className="px-3 py-1.5 rounded-lg bg-zinc-900"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          You are {isEditMode ? "Editing" : "Viewing"}
        </div>
        <button
          className="px-3 py-1.5 rounded-lg bg-zinc-700"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          Go to {isEditMode ? "View" : "Edit"} Mode
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from(new Array(25)).map((key, i) => {
          const tile = grid[i];
          return (
            <button
              onClick={() => onTileClick(tile.id, !tile.completed)}
              key={tile.id}
              className={cn(
                "w-full bg-white aspect-square rounded-xl relative p-1.5",
                tile.completed ? "bg-green-600" : "bg-zinc-700",
                "disabled:opacity-80"
              )}
              disabled={loadingTile === tile.id}
            >
              <p className="text-[clamp(10px,3vw,18px)] leading-tight">{tile.objective}</p>
              {loadingTile === tile.id && (
                <span className="absolute animate-spin size-10 border-6 top-1/2 left-1/2 rounded-full border-l-zinc-600 border-t-zinc-600 border-zinc-800 -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
