"use client";

import { BingoTile as BingoTileType } from "@/types";
import { useEffect, useState } from "react";
import BingoTile from "./BingoTile";
import client from "@/utils/supabase-client";

interface ComponentProps {
  initalGrid: BingoTileType[];
}
export default function BingoGrid({ initalGrid }: ComponentProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [grid, setGrid] = useState<BingoTileType[]>(initalGrid);

  useEffect(() => {
    const channel = client
      .channel("bingo")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "config",
          filter: "id=eq.BINGO",
        },
        (payload) => {
          setGrid(payload.new.options as BingoTileType[]);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

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
            <BingoTile
              key={tile.id}
              objective={tile.objective}
              completed={tile.completed}
              id={tile.id}
              isEditMode={isEditMode}
              setGrid={setGrid}
            />
          );
        })}
      </div>
    </div>
  );
}
