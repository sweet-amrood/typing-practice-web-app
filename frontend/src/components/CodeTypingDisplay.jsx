import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { resolveSyntaxColor } from '../utils/syntaxHighlight';

const CodeTypingDisplay = ({ text, input, syntaxClasses = [] }) => {
  const containerRef = useRef(null);
  const caretAnchorRef = useRef(null);
  const [caret, setCaret] = useState({ left: 0, top: 0, height: 0, visible: false });

  const classes = useMemo(() => {
    if (syntaxClasses.length === text.length) return syntaxClasses;
    return Array(text.length).fill('token-plain');
  }, [syntaxClasses, text]);

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
      height: anchorRect.height || 24,
      visible: true,
    });
  }, [input, text]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[14rem] w-full max-w-full whitespace-pre-wrap break-words font-mono text-sm leading-relaxed sm:text-base"
    >
      {text.split('').map((expectedChar, index) => {
        const isTyped = index < input.length;
        const typedChar = isTyped ? input[index] : null;
        const isCorrect = isTyped && typedChar === expectedChar;
        const isWrong = isTyped && typedChar !== expectedChar;
        const isCaretHere = index === input.length;

        let stateClass = resolveSyntaxColor(classes[index] ?? 'token-plain');

        if (isCorrect) {
          stateClass = 'text-emerald-400';
        } else if (isWrong) {
          stateClass = 'text-red-400';
        } else if (isCaretHere) {
          stateClass = `${resolveSyntaxColor(classes[index] ?? 'token-plain')} underline decoration-theme-accent decoration-2`;
        }

        const displayChar = isWrong ? typedChar : expectedChar;

        return (
          <span
            key={index}
            ref={isCaretHere ? caretAnchorRef : null}
            className={`transition-colors duration-75 ${stateClass}`}
          >
            {displayChar}
          </span>
        );
      })}

      {input.length === text.length && (
        <span ref={caretAnchorRef} className="inline-block w-0" aria-hidden="true" />
      )}

      {caret.visible && (
        <span
          className="pointer-events-none absolute w-0.5 rounded-full bg-theme-accent transition-all duration-100"
          style={{ left: caret.left, top: caret.top, height: caret.height }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default CodeTypingDisplay;
