/**
 * Safe, high-precision mathematical expression evaluator.
 * Implements a recursive descent parser supporting standard and scientific operations.
 * Absolutely NO unsafe `eval()` or `Function()` constructors.
 */

export type AngleMode = 'rad' | 'deg';

export interface EvaluationResult {
  value: number;
  formatted: string;
  error?: string;
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // JS Number overflow limit
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Tokenizes and evaluates math expressions safely
 */
export class MathExpressionEvaluator {
  private pos = 0;
  private str = '';
  private angleMode: AngleMode = 'rad';

  constructor(angleMode: AngleMode = 'rad') {
    this.angleMode = angleMode;
  }

  setAngleMode(mode: AngleMode) {
    this.angleMode = mode;
  }

  evaluate(expression: string): EvaluationResult {
    try {
      this.str = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, 'pi')
        .replace(/\s+/g, '');
      this.pos = 0;

      if (!this.str) {
        return { value: 0, formatted: '0' };
      }

      const val = this.parseExpression();
      if (this.pos < this.str.length) {
        throw new Error(`Unexpected character '${this.str[this.pos]}' at position ${this.pos}`);
      }

      if (isNaN(val)) {
        return { value: NaN, formatted: 'Undefined', error: 'Result is undefined or mathematically invalid' };
      }

      // Format neatly
      const formatted = Number.isInteger(val)
        ? val.toString()
        : Number(val.toPrecision(12)).toString();

      return { value: val, formatted };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid mathematical expression';
      return { value: NaN, formatted: 'Error', error: msg };
    }
  }

  private peek(): string {
    return this.str[this.pos] || '';
  }

  private get(): string {
    return this.str[this.pos++] || '';
  }

  // Expression: Addition & Subtraction
  private parseExpression(): number {
    let result = this.parseTerm();
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.get();
      const term = this.parseTerm();
      if (op === '+') result += term;
      else result -= term;
    }
    return result;
  }

  // Term: Multiplication, Division, Modulo
  private parseTerm(): number {
    let result = this.parseFactor();
    while (this.peek() === '*' || this.peek() === '/' || this.peek() === '%') {
      const op = this.get();
      const factor = this.parseFactor();
      if (op === '*') {
        result *= factor;
      } else if (op === '/') {
        if (factor === 0) throw new Error('Division by zero');
        result /= factor;
      } else if (op === '%') {
        result = result % factor;
      }
    }
    return result;
  }

  // Factor: Exponentiation (right-associative: 2^3^2 = 2^(3^2))
  private parseFactor(): number {
    let base = this.parseUnary();
    if (this.peek() === '^') {
      this.get();
      const exponent = this.parseFactor();
      base = Math.pow(base, exponent);
    }
    // Check for postfix factorial (e.g., 5!)
    while (this.peek() === '!') {
      this.get();
      base = factorial(base);
    }
    return base;
  }

  // Unary operators (+, -)
  private parseUnary(): number {
    if (this.peek() === '+') {
      this.get();
      return this.parseUnary();
    }
    if (this.peek() === '-') {
      this.get();
      return -this.parseUnary();
    }
    return this.parsePrimary();
  }

  // Primary: Numbers, Parentheses, Functions, Constants
  private parsePrimary(): number {
    const ch = this.peek();

    // Parentheses
    if (ch === '(') {
      this.get(); // consume '('
      const val = this.parseExpression();
      if (this.get() !== ')') throw new Error("Missing closing parenthesis ')'");
      return val;
    }

    // Number
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let numStr = '';
      while ((this.peek() >= '0' && this.peek() <= '9') || this.peek() === '.') {
        numStr += this.get();
      }
      // Scientific notation (e.g. 1.2e5 or 1e-4)
      if (this.peek() === 'e' || this.peek() === 'E') {
        const nextChar = this.str[this.pos + 1];
        if (nextChar === '+' || nextChar === '-' || (nextChar >= '0' && nextChar <= '9')) {
          numStr += this.get();
          if (this.peek() === '+' || this.peek() === '-') numStr += this.get();
          while (this.peek() >= '0' && this.peek() <= '9') numStr += this.get();
        }
      }
      return parseFloat(numStr);
    }

    // Identifiers (functions and constants)
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
      let id = '';
      while (
        (this.peek() >= 'a' && this.peek() <= 'z') ||
        (this.peek() >= 'A' && this.peek() <= 'Z') ||
        (this.peek() >= '0' && this.peek() <= '9')
      ) {
        id += this.get();
      }
      id = id.toLowerCase();

      // Constants
      if (id === 'pi') return Math.PI;
      if (id === 'e') return Math.E;

      // Function call
      if (this.peek() === '(') {
        this.get(); // consume '('
        const arg = this.parseExpression();
        if (this.get() !== ')') throw new Error(`Missing closing parenthesis for '${id}'`);

        const toRad = (x: number) => (this.angleMode === 'deg' ? (x * Math.PI) / 180 : x);
        const fromRad = (x: number) => (this.angleMode === 'deg' ? (x * 180) / Math.PI : x);

        switch (id) {
          case 'sin':
            return Math.sin(toRad(arg));
          case 'cos':
            return Math.cos(toRad(arg));
          case 'tan': {
            const rad = toRad(arg);
            if (Math.abs(Math.cos(rad)) < 1e-15) throw new Error('Tangent undefined at 90° + k*180°');
            return Math.tan(rad);
          }
          case 'asin':
          case 'arcsin':
            if (arg < -1 || arg > 1) throw new Error('asin argument must be between -1 and 1');
            return fromRad(Math.asin(arg));
          case 'acos':
          case 'arccos':
            if (arg < -1 || arg > 1) throw new Error('acos argument must be between -1 and 1');
            return fromRad(Math.acos(arg));
          case 'atan':
          case 'arctan':
            return fromRad(Math.atan(arg));
          case 'sinh':
            return Math.sinh(arg);
          case 'cosh':
            return Math.cosh(arg);
          case 'tanh':
            return Math.tanh(arg);
          case 'sqrt':
            if (arg < 0) throw new Error('Square root of negative number is undefined in real numbers');
            return Math.sqrt(arg);
          case 'cbrt':
            return Math.cbrt(arg);
          case 'abs':
            return Math.abs(arg);
          case 'log':
          case 'log10':
            if (arg <= 0) throw new Error('log10 argument must be strictly positive');
            return Math.log10(arg);
          case 'ln':
            if (arg <= 0) throw new Error('ln argument must be strictly positive');
            return Math.log(arg);
          case 'exp':
            return Math.exp(arg);
          case 'floor':
            return Math.floor(arg);
          case 'ceil':
            return Math.ceil(arg);
          case 'round':
            return Math.round(arg);
          default:
            throw new Error(`Unknown mathematical function '${id}'`);
        }
      }
      throw new Error(`Unexpected identifier '${id}' without arguments`);
    }

    throw new Error(`Unexpected character '${ch}'`);
  }
}
