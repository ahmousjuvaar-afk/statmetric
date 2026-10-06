import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { UNIT_DOMAINS, UnitDomain, convertUnits } from '../lib/converters/units';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';

export function UnitConverterPage() {
  const [domain, setDomain] = useState<UnitDomain>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState('1');
  const [copied, setCopied] = useState(false);

  const domainConfig = UNIT_DOMAINS[domain];

  // Set default units when domain changes
  const handleDomainChange = (newDomain: UnitDomain) => {
    setDomain(newDomain);
    const units = UNIT_DOMAINS[newDomain].units;
    setFromUnit(units[0].id);
    setToUnit(units[1] ? units[1].id : units[0].id);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const conversion = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      return { error: 'Please enter a valid numeric value.' };
    }
    try {
      const res = convertUnits(domain, fromUnit, toUnit, val);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid conversion.' };
    }
  }, [domain, fromUnit, toUnit, inputValue]);

  const handleCopy = () => {
    if (conversion.data) {
      navigator.clipboard.writeText(`${conversion.data.formatted}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const domainList: { id: UnitDomain; label: string }[] = [
    { id: 'length', label: 'Length' },
    { id: 'mass', label: 'Mass' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'area', label: 'Area' },
    { id: 'volume', label: 'Volume' },
    { id: 'speed', label: 'Speed' },
    { id: 'time', label: 'Time' },
    { id: 'data', label: 'Data Storage' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Unit Converter Suite - Metric & Imperial Physical Measurements | StatMetric"
        description="Free online unit converter for Length, Mass, Temperature, Area, Volume, Speed, Time, and Data storage. Convert with exact SI ratios and comprehensive tables."
        path="/calculators/unit-converter"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="unit-converter" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60">
              Converters
            </span>
            <span className="text-xs text-slate-500">8 Physical Domains · Exact SI Ratios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Unit Converter Suite
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Convert between metric, imperial, and digital units across length, mass, temperature, area, volume, velocity, time intervals, and digital storage.
          </p>
        </div>
      </div>

      {/* Domain Selection Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg mb-6">
        {domainList.map((d) => (
          <button
            key={d.id}
            onClick={() => handleDomainChange(d.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              domain === d.id
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Interactive Converter Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2.5 text-lg font-bold bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-medium text-slate-800"
            >
              {domainConfig.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200"
              title="Swap units"
              aria-label="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Input & Result */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">To (Result)</label>
              {conversion.data && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="w-full px-3 py-2.5 text-lg font-bold bg-slate-50 border border-slate-200 rounded-md font-mono text-blue-600 truncate min-h-[46px] flex items-center">
              {conversion.error ? (
                <span className="text-xs text-rose-600 font-normal">{conversion.error}</span>
              ) : (
                conversion.data?.formatted
              )}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md font-medium text-slate-800"
            >
              {domainConfig.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {conversion.data && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Formula: {conversion.data.formula}</span>
          </div>
        )}
      </div>

      {/* Comprehensive Domain Comparison Table */}
      {conversion.data && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Equivalent Values Across All {domainConfig.name} Units
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 px-3 font-semibold">Unit</th>
                  <th className="py-2 px-3 font-semibold">Symbol</th>
                  <th className="py-2 px-3 font-semibold text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {conversion.data.allConversions.map((item) => (
                  <tr
                    key={item.unit.id}
                    className={item.unit.id === toUnit ? 'bg-blue-50/70 font-bold text-blue-900' : 'hover:bg-slate-50'}
                  >
                    <td className="py-2 px-3 font-sans">{item.unit.name}</td>
                    <td className="py-2 px-3 text-slate-500">{item.unit.symbol}</td>
                    <td className="py-2 px-3 text-right">{item.formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <NextStepCard
        options={[
          {
            prompt: 'Calculate time durations or intervals?',
            toolName: 'Date & Time Calculator',
            path: '/calculators/date-calculator',
            description: 'Compute exact age, business days, and clock durations across midnight.',
          },
          {
            prompt: 'Perform scientific arithmetic?',
            toolName: 'Scientific Calculator',
            path: '/calculators/scientific-calculator',
            description: 'Powers, roots, logarithms, trigonometric functions, and parentheses.',
          },
          {
            prompt: 'Compute sample standard deviation?',
            toolName: 'Standard Deviation Calculator',
            path: '/calculators/standard-deviation',
            description: 'Find variance and spread with Bessel correction n-1.',
          },
        ]}
      />
    </div>
  );
}
