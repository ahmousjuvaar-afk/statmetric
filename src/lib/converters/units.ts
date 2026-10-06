/**
 * Comprehensive physical & digital unit conversion engine.
 * Supports 8 physical domains with exact SI ratios and standard conversions.
 */

export type UnitDomain =
  | 'length'
  | 'mass'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'time'
  | 'data';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  // Multiplier to convert 1 unit to base SI unit (or custom conversion for temperature)
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

export interface DomainConfig {
  domain: UnitDomain;
  name: string;
  baseUnit: string;
  description: string;
  units: UnitDefinition[];
}

export const UNIT_DOMAINS: Record<UnitDomain, DomainConfig> = {
  length: {
    domain: 'length',
    name: 'Length & Distance',
    baseUnit: 'm',
    description: 'Convert between metric and imperial linear measurements.',
    units: [
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01 },
      { id: 'm', name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (b) => b },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344 },
    ],
  },
  mass: {
    domain: 'mass',
    name: 'Mass & Weight',
    baseUnit: 'kg',
    description: 'Convert between metric grams/kilograms and imperial pounds/ounces.',
    units: [
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: (v) => v * 1e-6, fromBase: (b) => b / 1e-6 },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: (v) => v * 1e-3, fromBase: (b) => b / 1e-3 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b },
      { id: 't', name: 'Metric Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'oz', name: 'Ounce (avdp)', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (b) => b / 0.028349523125 },
      { id: 'lb', name: 'Pound (avdp)', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237 },
      { id: 'ton', name: 'US Short Ton', symbol: 'ton', toBase: (v) => v * 907.18474, fromBase: (b) => b / 907.18474 },
    ],
  },
  temperature: {
    domain: 'temperature',
    name: 'Temperature',
    baseUnit: 'C',
    description: 'Convert between Celsius (°C), Fahrenheit (°F), and absolute Kelvin (K).',
    units: [
      {
        id: 'c',
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (b) => b,
      },
      {
        id: 'f',
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (b) => (b * 9) / 5 + 32,
      },
      {
        id: 'k',
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (b) => b + 273.15,
      },
    ],
  },
  area: {
    domain: 'area',
    name: 'Area & Surface',
    baseUnit: 'sq_m',
    description: 'Convert between metric square units, acres, and imperial square footage.',
    units: [
      { id: 'sq_m', name: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b },
      { id: 'sq_km', name: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
      { id: 'sq_ft', name: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304 },
      { id: 'sq_yd', name: 'Square Yard', symbol: 'yd²', toBase: (v) => v * 0.83612736, fromBase: (b) => b / 0.83612736 },
      { id: 'sq_mi', name: 'Square Mile', symbol: 'mi²', toBase: (v) => v * 2589988.110336, fromBase: (b) => b / 2589988.110336 },
      { id: 'acre', name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000 },
    ],
  },
  volume: {
    domain: 'volume',
    name: 'Volume & Capacity',
    baseUnit: 'L',
    description: 'Convert between metric liters and US customary liquid measures.',
    units: [
      { id: 'ml', name: 'Milliliter', symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'l', name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (b) => b },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'cup', name: 'US Cup', symbol: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (b) => b / 0.2365882365 },
      { id: 'pt', name: 'US Pint', symbol: 'pt', toBase: (v) => v * 0.473176473, fromBase: (b) => b / 0.473176473 },
      { id: 'qt', name: 'US Quart', symbol: 'qt', toBase: (v) => v * 0.946352946, fromBase: (b) => b / 0.946352946 },
      { id: 'gal', name: 'US Gallon', symbol: 'gal', toBase: (v) => v * 3.785411784, fromBase: (b) => b / 3.785411784 },
      { id: 'fl_oz', name: 'Fluid Ounce', symbol: 'fl oz', toBase: (v) => v * 0.0295735295625, fromBase: (b) => b / 0.0295735295625 },
    ],
  },
  speed: {
    domain: 'speed',
    name: 'Speed & Velocity',
    baseUnit: 'm_s',
    description: 'Convert between metric meters/second, kilometers/hour, miles/hour, and nautical knots.',
    units: [
      { id: 'm_s', name: 'Meter per second', symbol: 'm/s', toBase: (v) => v, fromBase: (b) => b },
      { id: 'km_h', name: 'Kilometer per hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (b) => b * 3.6 },
      { id: 'mph', name: 'Mile per hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (b) => b / 0.44704 },
      { id: 'knot', name: 'Knot (nautical mi/h)', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (b) => b / 0.514444 },
    ],
  },
  time: {
    domain: 'time',
    name: 'Time Intervals',
    baseUnit: 's',
    description: 'Convert between seconds, minutes, hours, days, weeks, and years.',
    units: [
      { id: 'ms', name: 'Millisecond', symbol: 'ms', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 's', name: 'Second', symbol: 's', toBase: (v) => v, fromBase: (b) => b },
      { id: 'min', name: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (b) => b / 60 },
      { id: 'h', name: 'Hour', symbol: 'h', toBase: (v) => v * 3600, fromBase: (b) => b / 3600 },
      { id: 'd', name: 'Day', symbol: 'd', toBase: (v) => v * 86400, fromBase: (b) => b / 86400 },
      { id: 'wk', name: 'Week', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (b) => b / 604800 },
      { id: 'yr', name: 'Calendar Year (365.25 d)', symbol: 'yr', toBase: (v) => v * 31557600, fromBase: (b) => b / 31557600 },
    ],
  },
  data: {
    domain: 'data',
    name: 'Data & Digital Storage',
    baseUnit: 'byte',
    description: 'Convert between bits, bytes, kilobytes, megabytes, gigabytes, and terabytes (binary 1024 base).',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', toBase: (v) => v / 8, fromBase: (b) => b * 8 },
      { id: 'byte', name: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (b) => b / 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: (v) => v * Math.pow(1024, 2), fromBase: (b) => b / Math.pow(1024, 2) },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: (v) => v * Math.pow(1024, 3), fromBase: (b) => b / Math.pow(1024, 3) },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: (v) => v * Math.pow(1024, 4), fromBase: (b) => b / Math.pow(1024, 4) },
    ],
  },
};

export function convertUnits(
  domain: UnitDomain,
  fromUnitId: string,
  toUnitId: string,
  value: number
): {
  result: number;
  formatted: string;
  formula: string;
  allConversions: { unit: UnitDefinition; value: number; formatted: string }[];
} {
  const config = UNIT_DOMAINS[domain];
  const fromDef = config.units.find((u) => u.id === fromUnitId);
  const toDef = config.units.find((u) => u.id === toUnitId);

  if (!fromDef || !toDef) {
    throw new Error('Invalid source or target unit.');
  }

  // Convert to base, then to target
  const baseValue = fromDef.toBase(value);
  const targetValue = toDef.fromBase(baseValue);

  // Generate overview table for all units in this domain
  const allConversions = config.units.map((u) => {
    const val = u.fromBase(baseValue);
    return {
      unit: u,
      value: val,
      formatted: formatConvertedNumber(val),
    };
  });

  const formatted = formatConvertedNumber(targetValue);
  const formula = `1 ${fromDef.symbol} = ${formatConvertedNumber(toDef.fromBase(fromDef.toBase(1)))} ${toDef.symbol}`;

  return {
    result: targetValue,
    formatted,
    formula,
    allConversions,
  };
}

function formatConvertedNumber(num: number): string {
  if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-4 && num !== 0)) {
    return num.toExponential(5);
  }
  return Number(num.toPrecision(8)).toString();
}
