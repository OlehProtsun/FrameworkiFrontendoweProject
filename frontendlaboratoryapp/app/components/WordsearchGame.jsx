"use client";

import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/lib/AuthContext";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DEFAULT_GRID_SIZE = 10;
const DEFAULT_WORDS = ["DOG", "CAT", "MOUSE", "TIGER", "LION"];

const DEFAULT_BOARD_CONFIG = {
  lineColor: "#38bdf8",
  lineWidth: 1,
  fontFamily: "system-ui",
  theme: "dark",
};

// ───── helpers ─────

function getBorderWidthClass(lineWidth) {
  if (!lineWidth || lineWidth <= 1) return "border";
  if (lineWidth === 2) return "border-2";
  return "border-[3px]";
}

// генеруємо сітку n×n і розкладаємо в ній усі слова
function generateGrid(words, size) {
  const upperWords = words.map((w) => w.toUpperCase());

  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );

  const directions = [
    { dr: 0, dc: 1 },
    { dr: 0, dc: -1 },
    { dr: 1, dc: 0 },
    { dr: -1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: -1, dc: -1 },
  ];

  const placeWord = (word) => {
    const len = word.length;
    const maxAttempts = 200;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      const endRow = startRow + dir.dr * (len - 1);
      const endCol = startCol + dir.dc * (len - 1);

      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
        continue;
      }

      let ok = true;
      for (let i = 0; i < len; i++) {
        const r = startRow + dir.dr * i;
        const c = startCol + dir.dc * i;
        const existing = grid[r][c];
        if (existing !== null && existing !== word[i]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      for (let i = 0; i < len; i++) {
        const r = startRow + dir.dr * i;
        const c = startCol + dir.dc * i;
        grid[r][c] = word[i];
      }
      return;
    }
  };

  upperWords.forEach(placeWord);

  // заповнюємо пусті клітинки випадковими літерами
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        const letter =
          ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        grid[r][c] = letter;
      }
    }
  }

  return grid;
}

// шукає слово в сітці – для вже відгаданих слів
function findWordInGrid(grid, word) {
  const size = grid.length;
  const upper = word.toUpperCase();

  const directions = [
    { dr: 0, dc: 1 },
    { dr: 0, dc: -1 },
    { dr: 1, dc: 0 },
    { dr: -1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: -1, dc: -1 },
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== upper[0]) continue;

      for (const dir of directions) {
        const coords = [{ row: r, col: c }];
        let rr = r;
        let cc = c;
        let i = 1;

        for (; i < upper.length; i++) {
          rr += dir.dr;
          cc += dir.dc;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) break;
          if (grid[rr][cc] !== upper[i]) break;
          coords.push({ row: rr, col: cc });
        }

        if (i === upper.length) {
          return coords;
        }
      }
    }
  }

  return [];
}

// ───── główny komponent ─────

export default function WordsearchGame({ gameId }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [grid, setGrid] = useState([]);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [dictionary, setDictionary] = useState([]);

  const [foundWords, setFoundWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);

  const [boardConfig, setBoardConfig] = useState(DEFAULT_BOARD_CONFIG);

  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [lockedCells, setLockedCells] = useState(new Set());

  const [showRemainingWords, setShowRemainingWords] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // завантаження гри з Firestore (і створення дефолтної, якщо немає)
  useEffect(() => {
    if (!user || !gameId) return;

    const loadGame = async () => {
      setLoading(true);
      setError("");

      try {
        const ref = doc(db, "wordsearchGames", gameId);
        let snap = await getDoc(ref);

        if (!snap.exists()) {
          const initialData = {
            userUid: user.uid,
            title: "Default wordsearch",
            gridSize: DEFAULT_GRID_SIZE,
            foundWords: [],
            remainingWords: DEFAULT_WORDS,
            boardConfig: DEFAULT_BOARD_CONFIG,
          };

          await setDoc(ref, initialData);
          snap = await getDoc(ref);
        }

        const data = snap.data();
        const fw = (data.foundWords || []).map((w) => w.toUpperCase());
        const rw = (data.remainingWords || []).map((w) => w.toUpperCase());
        const size = data.gridSize || DEFAULT_GRID_SIZE;
        const config = data.boardConfig || {};

        const allWords = [...fw, ...rw];
        const generatedGrid = generateGrid(allWords, size);

        let foundSet = new Set();
        fw.forEach((word) => {
          const coords = findWordInGrid(generatedGrid, word);
          coords.forEach(({ row, col }) =>
            foundSet.add(`${row}-${col}`)
          );
        });

        setGrid(generatedGrid);
        setGridSize(size);
        setDictionary(allWords);
        setFoundWords(fw);
        setRemainingWords(rw);
        setBoardConfig({
          ...DEFAULT_BOARD_CONFIG,
          ...config,
        });
        setLockedCells(foundSet);
      } catch (err) {
        console.error("loadGame error:", err);
        setError("Nie udało się załadować gry z Firestore.");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [user, gameId]);

  const totalWords =
    dictionary.length || foundWords.length + remainingWords.length;
  const progress =
    totalWords > 0 ? Math.round((foundWords.length / totalWords) * 100) : 0;
  const allFound = totalWords > 0 && foundWords.length === totalWords;

  const borderWidthClass = getBorderWidthClass(boardConfig.lineWidth);
  const accentColor = boardConfig.lineColor || "#38bdf8";

  // ── логіка вибору комірок ──

  const startSelection = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const extendSelection = (row, col) => {
    setSelectedCells((prev) => {
      if (!isSelecting) return prev;
      if (prev.some((c) => c.row === row && c.col === col)) return prev;

      if (prev.length === 0) return [{ row, col }];
      if (prev.length === 1) return [...prev, { row, col }];

      const first = prev[0];
      const second = prev[1];

      const dr = Math.sign(second.row - first.row);
      const dc = Math.sign(second.col - first.col);
      const last = prev[prev.length - 1];

      if (row === last.row + dr && col === last.col + dc) {
        return [...prev, { row, col }];
      }

      return prev;
    });
  };

  const finishSelection = async () => {
    if (!isSelecting) return;

    setIsSelecting(false);

    if (!selectedCells.length) {
      setSelectedCells([]);
      return;
    }

    const word = selectedCells
      .map(({ row, col }) => grid[row][col])
      .join("")
      .toUpperCase();

    if (remainingWords.includes(word)) {
      const newFound = [...foundWords, word];
      const newRemaining = remainingWords.filter((w) => w !== word);

      setFoundWords(newFound);
      setRemainingWords(newRemaining);
      setLockedCells((prev) => {
        const next = new Set(prev);
        selectedCells.forEach(({ row, col }) =>
          next.add(`${row}-${col}`)
        );
        return next;
      });
      setSelectedCells([]);

      try {
        const ref = doc(db, "wordsearchGames", gameId);
        await updateDoc(ref, {
          foundWords: arrayUnion(word),
          remainingWords: arrayRemove(word),
        });
      } catch (err) {
        console.error("Error updating Firestore:", err);
      }
    } else {
      setSelectedCells([]);
    }
  };

  // restart gry – очищаємо стан + перегенеруємо сітку
  const handleRestart = async () => {
    if (!dictionary.length) return;

    const size = gridSize || DEFAULT_GRID_SIZE;
    const newGrid = generateGrid(dictionary, size);

    setGrid(newGrid);
    setFoundWords([]);
    setRemainingWords(dictionary);
    setLockedCells(new Set());
    setSelectedCells([]);

    try {
      const ref = doc(db, "wordsearchGames", gameId);
      await updateDoc(ref, {
        foundWords: [],
        remainingWords: dictionary,
      });
    } catch (err) {
      console.error("Error resetting game:", err);
    }
  };

  // оновлення стилів і запис у Firestore
  const updateBoardConfig = async (partial) => {
    const newConfig = { ...boardConfig, ...partial };
    setBoardConfig(newConfig);

    try {
      setSavingConfig(true);
      const ref = doc(db, "wordsearchGames", gameId);
      await updateDoc(ref, {
        boardConfig: newConfig,
      });
    } catch (err) {
      console.error("Error updating board config:", err);
    } finally {
      setSavingConfig(false);
    }
  };

  // ───── widok ─────

  if (!user) return null;

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-6 text-sm text-slate-200 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
        Loading wordsearch...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-6 text-sm text-rose-100 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* info + success badge */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Wordsearch
          </p>
          <p className="text-sm text-slate-200">
            Select words horizontally, vertically or diagonally.
          </p>
        </div>

        {allFound && (
          <div className="inline-flex items-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 pl-1.5 pr-3 py-1.5 text-xs font-medium text-emerald-100">
            <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
              ✓
            </span>
            All words found – great job!
          </div>
        )}
      </div>

      {/* progress bar + restart */}
      <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Progress</span>
          <span>
            {foundWords.length} / {totalWords} words ({progress}%)
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-900/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-violet-500 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {allFound && (
          <div className="pt-1">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-medium text-white shadow-[0_8px_24px_rgba(56,189,248,0.55)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Restart game
            </button>
          </div>
        )}
      </div>

      {/* основна область: грід + списки + board appearance збоку */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)] items-start">
        {/* ліва частина: грід + списки слів */}
        <div className="space-y-4">
          {/* сіточка */}
          <div
            className="inline-flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.9)]"
            onMouseUp={finishSelection}
            onMouseLeave={finishSelection}
          >
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((letter, cIdx) => {
                  const key = `${rIdx}-${cIdx}`;
                  const isLocked = lockedCells.has(key);
                  const isSelected = selectedCells.some(
                    (c) => c.row === rIdx && c.col === cIdx
                  );

                  let stateClasses =
                    "bg-slate-900/60 border-slate-700 text-slate-100 hover:border-sky-500/60 cursor-pointer";
                  if (isLocked) {
                    stateClasses =
                      "bg-emerald-500/30 border-emerald-400 text-emerald-50";
                  } else if (isSelected) {
                    stateClasses =
                      "bg-sky-500/30 border-sky-400 text-sky-50";
                  }

                  return (
                    <button
                      key={key}
                      type="button"
                      onMouseDown={() => startSelection(rIdx, cIdx)}
                      onMouseEnter={() => extendSelection(rIdx, cIdx)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition ${borderWidthClass} ${stateClasses}`}
                      style={{
                        fontFamily: boardConfig.fontFamily,
                        borderColor:
                          isSelected || isLocked ? accentColor : undefined,
                      }}
                    >
                      {letter}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* списки слів під грідом */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* знайдені */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                Found words
              </p>
              {foundWords.length === 0 ? (
                <p className="text-xs text-slate-500">
                  You haven&apos;t found any words yet.
                </p>
              ) : (
                <ul className="space-y-1 text-xs text-emerald-100">
                  {foundWords.map((w) => (
                    <li
                      key={w}
                      className="line-through decoration-emerald-400"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* залишились (з маскуванням) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-300">
                  Remaining words
                </p>
                {remainingWords.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowRemainingWords((prev) => !prev)
                    }
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-100 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-sky-400/70"
                  >
                    <span>
                      {showRemainingWords ? "Hide" : "Show"}
                    </span>
                    {showRemainingWords ? (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M4.2 4.2 3 5.4l3.1 3.1C4 9.7 2.4 11.6 1.5 12c1.6 3.9 5.5 7 10.5 7 1.7 0 3.3-.3 4.8-.9l3.2 3.2 1.2-1.2zM12 17c-2.8 0-5-2.2-5-5 0-.5.1-1 .2-1.5l1.7 1.7a3 3 0 0 0 3.6 3.6l1.7 1.7c-.5.1-1 .2-1.5.2zm9-5c-.5-1.2-1.3-2.4-2.4-3.5A10.8 10.8 0 0 0 12 5c-.8 0-1.6.1-2.3.3L8 3.6C9.3 3.2 10.7 3 12 3c5 0 8.9 3.1 10.5 7-.3.8-.8 1.5-1.5 2.4z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M12 5C7 5 3.1 8.1 1.5 12c1.6 3.9 5.5 7 10.5 7s8.9-3.1 10.5-7C20.9 8.1 17 5 12 5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                          fill="currentColor"
                          opacity="0.9"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="2"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {remainingWords.length === 0 ? (
                <p className="text-xs text-slate-500">
                  All words found 🎉
                </p>
              ) : (
                <ul className="space-y-1 text-xs text-sky-100">
                  {remainingWords.map((w) => {
                    const masked = "•".repeat(w.length);
                    return (
                      <li key={w}>
                        {showRemainingWords ? w : masked}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* права колонка: панель стилів */}
        <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/80 px-3 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Board appearance
            </p>
            {savingConfig && (
              <span className="text-[10px] text-slate-500">
                Saving…
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* line color */}
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400">Line color</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={boardConfig.lineColor}
                  onChange={(e) =>
                    updateBoardConfig({ lineColor: e.target.value })
                  }
                  className="h-8 w-8 cursor-pointer rounded-lg border border-white/20 bg-transparent p-0"
                />
                <span className="text-[10px] text-slate-400">
                  {boardConfig.lineColor}
                </span>
              </div>
            </div>

            {/* line width */}
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400">Line width</p>
              <select
                value={boardConfig.lineWidth}
                onChange={(e) =>
                  updateBoardConfig({
                    lineWidth: Number(e.target.value),
                  })
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-2 py-1.5 text-[11px] text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500/40"
              >
                <option value={1}>Thin</option>
                <option value={2}>Medium</option>
                <option value={3}>Bold</option>
              </select>
            </div>

            {/* font */}
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400">Font</p>
              <select
                value={boardConfig.fontFamily}
                onChange={(e) =>
                  updateBoardConfig({ fontFamily: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-2 py-1.5 text-[11px] text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500/40"
              >
                <option value="system-ui">System</option>
                <option value="ui-monospace">Monospace</option>
                <option value="serif">Serif</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
