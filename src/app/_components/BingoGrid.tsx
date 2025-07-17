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
      <div className="flex items-center justify-center mb-3 bg-zinc-900 w-fit mx-auto px-3 py-1.5 rounded-xl">
        <button
          className="px-3 py-1 rounded-lg disabled:bg-zinc-800 bg-transparent opacity-75 disabled:opacity-100"
          disabled={!isEditMode}
          onClick={() => setIsEditMode(false)}
        >
          View
        </button>
        <button
          className="px-3 py-1 rounded-lg disabled:bg-zinc-800 bg-transparent opacity-75 disabled:opacity-100"
          disabled={isEditMode}
          onClick={() => setIsEditMode(true)}
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-5">
        {Array.from(new Array(25)).map((_, i) => {
          const tile = grid[i];
          return (
            <button
              onClick={() => onTileClick(tile.id, !tile.completed)}
              key={tile.id}
              className={cn(
                "w-full aspect-square relative p-3 border border-zinc-700",
                tile.completed ? "bg-green-600" : ""
              )}
              disabled={loadingTile === tile.id}
            >
              <div className={cn(loadingTile === tile.id ? "opacity-50" : "")}>
                <p className="text-[clamp(10px,3vw,18px)] leading-tight">{tile.objective}</p>
              </div>
              {loadingTile === tile.id && (
                <span className="absolute animate-spin size-10 border-6 top-1/2 left-1/2 rounded-full border-l-zinc-300 border-t-zinc-300 border-zinc-500 -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
