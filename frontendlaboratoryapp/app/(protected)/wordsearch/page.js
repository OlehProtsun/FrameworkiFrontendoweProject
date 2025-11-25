import WordsearchGame from "@/app/components/WordsearchGame";

export default function WordsearchPage() {
  const gameId = "OXFYNDT1kw31qtr1G0Xy";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">
          Wordsearch game
        </h1>
        <p className="text-xs text-slate-400">
          Interactive wordsearch with Firebase-saved progress.
        </p>
      </div>

      <WordsearchGame gameId={gameId} />
    </div>
  );
}
