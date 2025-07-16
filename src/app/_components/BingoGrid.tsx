"use client";

import { BingoTile } from "@/types";
import cn from "@/utils/tailwind";
import { toggleTile } from "./actions";
import { useState } from "react";

interface ComponentProps {
  initalGrid: BingoTile[];
}
export default function BingoGrid({ initalGrid }: ComponentProps) {
  const [grid, setGrid] = useState<BingoTile[]>(initalGrid);
  const [loadingTile, setLoadingTile] = useState<string | null>(null);

  async function onTileClick(tile_id: string, completed: boolean) {
    setLoadingTile(tile_id);
    const result = await toggleTile(tile_id, completed);
    setGrid(result);
    setLoadingTile(null);
  }

  return (
    <div className="grid grid-cols-5 gap-3 max-w-4xl mx-auto p-3 w-full">
      {Array.from(new Array(25)).map((key, i) => {
        const tile = grid[i];
        return (
          <button
            onClick={() => onTileClick(tile.id, !tile.completed)}
            key={tile.id}
            className={cn(
              "w-full bg-white aspect-square rounded-2xl relative p-1",
              tile.completed ? "bg-green-600" : "bg-zinc-700",
              "disabled:opacity-80"
            )}
            disabled={loadingTile === tile.id}
          >
            <span className="text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {tile.objective}
            </span>
            {loadingTile === tile.id && (
              <span className="absolute animate-spin size-16 border-8 rounded-full border-l-zinc-600 border-t-zinc-600 border-zinc-800 -translate-x-1/2 -translate-y-1/2" />
            )}
          </button>
        );
      })}
    </div>
  );
}
