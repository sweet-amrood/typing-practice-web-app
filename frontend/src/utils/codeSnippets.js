const JAVASCRIPT_SNIPPETS = [
  `function greet(name) {
  return \`Hello, \${name}!\`;
}

const user = { id: 1, active: true };
console.log(greet(user.name));`,
  `const sum = (items) => items.reduce((a, b) => a + b, 0);
const nums = [1, 2, 3, 4, 5];
const total = sum(nums);`,
  `async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed');
  return res.json();
}`,
  `const debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};`,
];

const PYTHON_SNIPPETS = [
  `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
  `class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def greet(self):
        return f"Hello, {self.name}!"`,
  `from typing import List

def average(values: List[float]) -> float:
    return sum(values) / len(values)`,
  `with open("data.txt", "r") as f:
    lines = [line.strip() for line in f if line.strip()]`,
];

const SQL_SNIPPETS = [
  `SELECT u.username, COUNT(r.id) AS tests
FROM users u
LEFT JOIN results r ON r.user_id = u.id
GROUP BY u.username
ORDER BY tests DESC;`,
  `SELECT DATE(created_at) AS day, AVG(wpm) AS avg_wpm
FROM test_results
WHERE user_id = 42
GROUP BY day
HAVING avg_wpm > 50;`,
  `UPDATE progress
SET highest_wpm = GREATEST(highest_wpm, 75)
WHERE user_id = 1;`,
  `CREATE INDEX idx_results_user_date
ON test_results (user_id, date DESC);`,
];

const JAVA_SNIPPETS = [
  `public class Greeter {
  private final String name;

  public Greeter(String name) {
    this.name = name;
  }

  public String greet() {
    return "Hello, " + name + "!";
  }
}`,
  `List<String> names = Arrays.asList("Ada", "Alan", "Grace");
names.stream()
    .filter(n -> n.startsWith("A"))
    .forEach(System.out::println);`,
  `try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
  String line;
  while ((line = reader.readLine()) != null) {
    System.out.println(line);
  }
}`,
];

const REACT_SNIPPETS = [
  `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}`,
  `useEffect(() => {
  const controller = new AbortController();
  fetchData(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);`,
  `const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}`,
  `const filtered = useMemo(
  () => items.filter((item) => item.active),
  [items]
);`,
];

export const CODE_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', prismLang: 'javascript' },
  { id: 'python', label: 'Python', prismLang: 'python' },
  { id: 'sql', label: 'SQL', prismLang: 'sql' },
  { id: 'java', label: 'Java', prismLang: 'java' },
  { id: 'react', label: 'React', prismLang: 'jsx' },
];

const SNIPPET_POOLS = {
  javascript: JAVASCRIPT_SNIPPETS,
  python: PYTHON_SNIPPETS,
  sql: SQL_SNIPPETS,
  java: JAVA_SNIPPETS,
  react: REACT_SNIPPETS,
};

export const pickCodeSnippet = (language, excludeIndex = null) => {
  const pool = SNIPPET_POOLS[language] ?? JAVASCRIPT_SNIPPETS;
  const available = pool.map((text, index) => ({ text, index }));

  const choices =
    excludeIndex === null
      ? available
      : available.filter((item) => item.index !== excludeIndex);

  const pick = choices[Math.floor(Math.random() * choices.length)] ?? available[0];
  return { text: pick.text, contentIndex: pick.index };
};
