import { useEffect, useState } from 'react';
import TypingCaret from './TypingCaret';

const TypewriterHeadline = ({
  phrases,
  className = '',
  speed = 55,
  pause = 2200,
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = phrases[phraseIndex % phrases.length] ?? '';

  useEffect(() => {
    const atEnd = charIndex === current.length;
    const atStart = charIndex === 0;

    let delay = speed;

    if (!deleting && atEnd) {
      delay = pause;
    } else if (deleting) {
      delay = speed / 2;
    }

    const timer = setTimeout(() => {
      if (!deleting && atEnd) {
        setDeleting(true);
        return;
      }

      if (deleting && atStart) {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
        return;
      }

      setCharIndex((i) => i + (deleting ? -1 : 1));
    }, delay);

    return () => clearTimeout(timer);
  }, [charIndex, current.length, deleting, pause, phrases.length, speed]);

  return (
    <span className={`inline text-theme-accent ${className}`}>
      {current.slice(0, charIndex)}
      <TypingCaret />
    </span>
  );
};

export default TypewriterHeadline;
