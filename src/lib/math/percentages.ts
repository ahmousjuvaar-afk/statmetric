/**
 * Percentage calculation engine covering 5 core quantitative modes:
 * 1. What is P% of X?
 * 2. X is what percent of Y?
 * 3. Percentage increase / decrease from X to Y
 * 4. Percentage difference between X and Y
 * 5. Reverse percentage: Original value before P% change
 */

export type PercentageMode =
  | 'percent_of'
  | 'is_what_percent'
  | 'percent_change'
  | 'percent_difference'
  | 'reverse_percent';

export interface PercentageResult {
  mode: PercentageMode;
  primaryResult: number;
  formattedResult: string;
  explanation: string;
  formula: string;
  steps: { title: string; content: string }[];
}

export function calculatePercentage(
  mode: PercentageMode,
  val1: number,
  val2: number,
  changeDirection: 'increase' | 'decrease' = 'increase'
): PercentageResult {
  if (isNaN(val1) || isNaN(val2)) {
    throw new Error('Please enter valid numeric values.');
  }

  const steps: { title: string; content: string }[] = [];

  switch (mode) {
    case 'percent_of': {
      // What is val1% of val2?
      const result = (val1 / 100) * val2;
      steps.push({
        title: 'Convert Percentage to Decimal',
        content: `${val1}% = ${val1} ÷ 100 = ${(val1 / 100).toFixed(4)}`,
      });
      steps.push({
        title: 'Multiply by Total',
        content: `${(val1 / 100).toFixed(4)} × ${val2} = ${Number(result.toFixed(6))}`,
      });
      return {
        mode,
        primaryResult: result,
        formattedResult: Number(result.toFixed(4)).toString(),
        explanation: `${val1}% of ${val2} is ${Number(result.toFixed(4))}.`,
        formula: '\\text{Result} = \\left(\\frac{P}{100}\\right) \\times X',
        steps,
      };
    }

    case 'is_what_percent': {
      // val1 is what % of val2?
      if (val2 === 0) throw new Error('Base value cannot be zero.');
      const result = (val1 / val2) * 100;
      steps.push({
        title: 'Divide Part by Whole',
        content: `${val1} ÷ ${val2} = ${(val1 / val2).toFixed(6)}`,
      });
      steps.push({
        title: 'Multiply by 100%',
        content: `${(val1 / val2).toFixed(6)} × 100% = ${Number(result.toFixed(4))}%`,
      });
      return {
        mode,
        primaryResult: result,
        formattedResult: `${Number(result.toFixed(4))}%`,
        explanation: `${val1} is ${Number(result.toFixed(4))}% of ${val2}.`,
        formula: 'P = \\left(\\frac{X}{Y}\\right) \\times 100\\%',
        steps,
      };
    }

    case 'percent_change': {
      // From val1 to val2
      if (val1 === 0) throw new Error('Initial value cannot be zero for percent change.');
      const diff = val2 - val1;
      const result = (diff / Math.abs(val1)) * 100;
      const isIncrease = diff >= 0;
      steps.push({
        title: 'Calculate Absolute Difference',
        content: `New Value (${val2}) - Initial Value (${val1}) = ${diff >= 0 ? '+' : ''}${diff}`,
      });
      steps.push({
        title: 'Divide by Absolute Initial Value',
        content: `${diff} ÷ |${val1}| = ${(diff / Math.abs(val1)).toFixed(6)}`,
      });
      steps.push({
        title: 'Convert to Percentage',
        content: `${(diff / Math.abs(val1)).toFixed(6)} × 100% = ${Number(result.toFixed(4))}%`,
      });
      return {
        mode,
        primaryResult: result,
        formattedResult: `${result >= 0 ? '+' : ''}${Number(result.toFixed(4))}%`,
        explanation: `Changing from ${val1} to ${val2} represents a ${Math.abs(Number(result.toFixed(4)))}% ${
          isIncrease ? 'increase' : 'decrease'
        }.`,
        formula: '\\text{\\% Change} = \\left(\\frac{V_2 - V_1}{|V_1|}\\right) \\times 100\\%',
        steps,
      };
    }

    case 'percent_difference': {
      // Percent difference between two positive values: |V1 - V2| / ((V1 + V2) / 2) * 100
      const avg = (Math.abs(val1) + Math.abs(val2)) / 2;
      if (avg === 0) throw new Error('Average cannot be zero.');
      const diff = Math.abs(val1 - val2);
      const result = (diff / avg) * 100;
      steps.push({
        title: 'Calculate Absolute Difference',
        content: `|${val1} - ${val2}| = ${diff}`,
      });
      steps.push({
        title: 'Calculate Average of the Two Values',
        content: `(|${val1}| + |${val2}|) ÷ 2 = ${avg}`,
      });
      steps.push({
        title: 'Divide Difference by Average and Multiply by 100',
        content: `(${diff} ÷ ${avg}) × 100% = ${Number(result.toFixed(4))}%`,
      });
      return {
        mode,
        primaryResult: result,
        formattedResult: `${Number(result.toFixed(4))}%`,
        explanation: `The percentage difference between ${val1} and ${val2} is ${Number(result.toFixed(4))}%.`,
        formula: '\\text{\\% Difference} = \\frac{|V_1 - V_2|}{(V_1 + V_2)/2} \\times 100\\%',
        steps,
      };
    }

    case 'reverse_percent': {
      // Find original value given final value val1 and change val2%
      // if increase: final = original * (1 + val2/100) => original = final / (1 + val2/100)
      // if decrease: final = original * (1 - val2/100) => original = final / (1 - val2/100)
      const factor = changeDirection === 'increase' ? 1 + val2 / 100 : 1 - val2 / 100;
      if (factor === 0) throw new Error('A 100% decrease cannot be reversed (division by zero).');
      const original = val1 / factor;
      steps.push({
        title: 'Determine Multiplier Factor',
        content: `1 ${changeDirection === 'increase' ? '+' : '-'} (${val2} ÷ 100) = ${factor.toFixed(4)}`,
      });
      steps.push({
        title: 'Divide Final Value by Factor',
        content: `${val1} ÷ ${factor.toFixed(4)} = ${Number(original.toFixed(6))}`,
      });
      return {
        mode,
        primaryResult: original,
        formattedResult: Number(original.toFixed(4)).toString(),
        explanation: `If a value becomes ${val1} after a ${val2}% ${changeDirection}, the original value was ${Number(
          original.toFixed(4)
        )}.`,
        formula: `\\text{Original} = \\frac{\\text{Final}}{1 ${changeDirection === 'increase' ? '+' : '-'} (P/100)}`,
        steps,
      };
    }
  }
}
