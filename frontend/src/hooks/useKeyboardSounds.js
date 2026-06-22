import { useCallback } from 'react';
import { playKeystrokeSound } from '../utils/keyboardSounds';

const useKeyboardSounds = (soundPackId) => {
  const onKeystroke = useCallback(
    (isError = false) => {
      playKeystrokeSound(soundPackId, { isError });
    },
    [soundPackId]
  );

  return onKeystroke;
};

export default useKeyboardSounds;
