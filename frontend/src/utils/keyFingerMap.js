export const FINGER_LABELS = {
  left_pinky: 'Left pinky',
  left_ring: 'Left ring',
  left_middle: 'Left middle',
  left_index: 'Left index',
  right_index: 'Right index',
  right_middle: 'Right middle',
  right_ring: 'Right ring',
  right_pinky: 'Right pinky',
  thumb: 'Thumb',
};

const FINGER_MAP = {
  '`': 'left_pinky', '1': 'left_pinky', '2': 'left_ring', '3': 'left_middle',
  '4': 'left_index', '5': 'left_index', '6': 'right_index', '7': 'right_index',
  '8': 'right_middle', '9': 'right_ring', '0': 'right_pinky', '-': 'right_pinky',
  '=': 'right_pinky', q: 'left_pinky', w: 'left_ring', e: 'left_middle',
  r: 'left_index', t: 'left_index', y: 'right_index', u: 'right_index',
  i: 'right_middle', o: 'right_ring', p: 'right_pinky', '[': 'right_pinky',
  ']': 'right_pinky', '\\': 'right_pinky', a: 'left_pinky', s: 'left_ring',
  d: 'left_middle', f: 'left_index', g: 'left_index', h: 'right_index',
  j: 'right_index', k: 'right_middle', l: 'right_ring', ';': 'right_pinky',
  "'": 'right_pinky', z: 'left_pinky', x: 'left_ring', c: 'left_middle',
  v: 'left_index', b: 'left_index', n: 'right_index', m: 'right_index',
  ',': 'right_middle', '.': 'right_ring', '/': 'right_pinky', ' ': 'thumb',
};

export const getFingerForChar = (char) => {
  if (!char) return 'unknown';
  const key = char.length === 1 ? char.toLowerCase() : char;
  return FINGER_MAP[key] ?? 'unknown';
};
