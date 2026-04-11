import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { currency } from '../../lib/utils';

interface MortgageCalculatorProps {
  price: number;
}

export function MortgageCalculator({ price }: MortgageCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [rate, setRate] = useState(6.3);
  const [termYears, setTermYears] = useState(30);

  const { monthlyPayment, schedule } = useMemo(() => {
    const principal = price * (1 - downPaymentPercent / 100);
    const monthlyRate = rate / 100 / 12;
    const totalPayments = termYears * 12;
    const payment = monthlyRate === 0 ? principal / totalPayments : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -totalPayments);

    let balance = principal;
    const amortization: Array<{ year: string; balance: number; principal: number }> = [];
    for (let year = 1; year <= Math.min(termYears, 10); year += 1) {
      let principalPaid = 0;
      for (let month = 0; month < 12; month += 1) {
        const interestPaid = balance * monthlyRate;
        const principalForMonth = payment - interestPaid;
        balance = Math.max(0, balance - principalForMonth);
        principalPaid += principalForMonth;
      }
      amortization.push({ year: `Y${year}`, balance: Math.round(balance), principal: Math.round(principalPaid) });
    }

    return { monthlyPayment: payment, schedule: amortization };
  }, [downPaymentPercent, price, rate, termYears]);

  return (
    <div className="card-elevated space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-white">Mortgage calculator</h3>
        <p className="mt-1 text-sm text-slate-300">Model principal and interest plus a 10-year amortization snapshot.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Down payment: {downPaymentPercent}%</span>
          <input className="w-full accent-cyan-400" max="40" min="5" onChange={(event) => setDownPaymentPercent(Number(event.target.value))} type="range" value={downPaymentPercent} />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Rate: {rate}%</span>
          <input className="w-full accent-cyan-400" max="9" min="4" onChange={(event) => setRate(Number(event.target.value))} step="0.1" type="range" value={rate} />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Term: {termYears} years</span>
          <input className="w-full accent-cyan-400" max="30" min="10" onChange={(event) => setTermYears(Number(event.target.value))} step="5" type="range" value={termYears} />
        </label>
      </div>
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-100">Estimated monthly payment</p>
        <p className="mt-2 text-4xl font-semibold text-white">{currency(monthlyPayment)}</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={schedule}>
            <defs>
              <linearGradient id="mortgageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} formatter={(value) => currency(value)} />
            <Area type="monotone" dataKey="balance" stroke="#22d3ee" fill="url(#mortgageGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
