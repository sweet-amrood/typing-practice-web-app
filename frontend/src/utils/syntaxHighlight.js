import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';

const flattenTokens = (tokens, classes, tokenClasses) => {
  for (const token of tokens) {
    if (typeof token === 'string') {
      for (let i = 0; i < token.length; i += 1) {
        classes.push(tokenClasses.join(' ') || 'token-plain');
      }
    } else {
      const nextClasses = [...tokenClasses, `token-${token.type}`];

      if (typeof token.content === 'string') {
        for (let i = 0; i < token.content.length; i += 1) {
          classes.push(nextClasses.join(' ') || 'token-plain');
        }
      } else {
        flattenTokens(token.content, classes, nextClasses);
      }
    }
  }
};

export const buildSyntaxClasses = (text, prismLang) => {
  const grammar = Prism.languages[prismLang] ?? Prism.languages.javascript;
  const tokens = Prism.tokenize(text, grammar);
  const classes = [];
  flattenTokens(tokens, classes, []);
  return classes;
};

export const SYNTAX_CLASS_COLORS = {
  'token-keyword': 'text-purple-400',
  'token-string': 'text-emerald-400',
  'token-function': 'text-sky-400',
  'token-number': 'text-amber-300',
  'token-operator': 'text-theme-text-secondary',
  'token-punctuation': 'text-theme-muted',
  'token-comment': 'text-theme-muted italic',
  'token-class-name': 'text-yellow-300',
  'token-builtin': 'text-cyan-400',
  'token-plain': 'text-theme-text-secondary',
};

export const resolveSyntaxColor = (classString) => {
  const parts = classString.split(' ');
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (SYNTAX_CLASS_COLORS[parts[i]]) {
      return SYNTAX_CLASS_COLORS[parts[i]];
    }
  }
  return SYNTAX_CLASS_COLORS['token-plain'];
};
