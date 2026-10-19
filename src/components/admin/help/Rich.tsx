/** Shows the names of buttons and fields (written in “curly quotes” in the guides) in bold, so they are easy to spot. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(“[^”]+”)/g).map((part, i) =>
        part.startsWith("“") ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
