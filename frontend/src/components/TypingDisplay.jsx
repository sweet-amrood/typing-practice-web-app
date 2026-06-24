import { useLayoutEffect, useRef, useState } from 'react';
import '../styles/typing-trails.css';

const renderCharSpan = ({
  index,
  expectedChar,
  input,
  text,
  isCurrentWord,
  caretAnchorRef,
  trailStyle,
}) => {
  const isTyped = index < input.length;
  const typedChar = isTyped ? input[index] : null;
  const isCorrect = isTyped && typedChar === expectedChar;
  const isWrong = isTyped && typedChar !== expectedChar;
  const isCaretHere = index === input.length;
  const isLatestCorrect = isCorrect && index === input.length - 1;

  let className = 'text-theme-muted';

  if (isCorrect) {
    className = 'text-emerald-400';
    if (trailStyle && trailStyle !== 'normal' && isLatestCorrect) {
      className += ` typing-trail--${trailStyle}`;
    }
  } else if (isWrong) {
    className = 'text-red-400';
  } else if (isCaretHere) {
    className = 'text-theme-text-secondary';
  }

  const displayChar = expectedChar;

  return (
    <span
      key={index}
      ref={isCaretHere ? caretAnchorRef : null}
      className={`rounded-sm transition-colors duration-100 ${className} ${
        isCurrentWord ? 'bg-theme-accent/20' : ''
      }`}
    >
      {displayChar}
    </span>
  );
};

const TypingDisplay = ({ text, input, currentWordIndex, wordRanges, trailStyle = 'normal' }) => {
  const containerRef = useRef(null);
  const caretAnchorRef = useRef(null);
  const [caret, setCaret] = useState({ left: 0, top: 0, height: 0, visible: false });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const anchor = caretAnchorRef.current;

    if (!container || !anchor || input.length > text.length) {
      setCaret((prev) => ({ ...prev, visible: false }));
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();

    setCaret({
      left: anchorRect.left - containerRect.left,
      top: anchorRect.top - containerRect.top,
      height: anchorRect.height || 28,
      visible: true,
    });
  }, [input, text, wordRanges, currentWordIndex]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[12rem] w-full max-w-full whitespace-normal break-words text-xl leading-loose tracking-wide sm:min-h-[14rem] sm:text-2xl sm:leading-loose md:text-[1.65rem]"
    >
      {wordRanges.map((range, wordIdx) => (
        <span key={range.start} className="inline">
          <span
            className={`inline rounded-sm transition-colors duration-100 ${
              wordIdx === currentWordIndex ? 'bg-theme-accent/20' : ''
            }`}
          >
            {text.slice(range.start, range.end).split('').map((expectedChar, charOffset) =>
              renderCharSpan({
                index: range.start + charOffset,
                expectedChar,
                input,
                text,
                isCurrentWord: false,
                caretAnchorRef,
                trailStyle,
              })
            )}
          </span>
          {wordIdx < wordRanges.length - 1 &&
            renderCharSpan({
              index: range.end,
              expectedChar: text[range.end],
              input,
              text,
              isCurrentWord: false,
              caretAnchorRef,
              trailStyle,
            })}
        </span>
      ))}

      {input.length === text.length && (
        <span
          ref={caretAnchorRef}
          className="inline-block w-0 align-baseline"
          aria-hidden="true"
        />
      )}

      {caret.visible && (
        <span
          className="pointer-events-none absolute w-0.5 rounded-full bg-theme-accent transition-all duration-100 ease-out will-change-[left,top,height]"
          style={{
            left: caret.left,
            top: caret.top,
            height: caret.height,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default TypingDisplay;
