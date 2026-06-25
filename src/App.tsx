import { useState, useMemo } from 'react';
import { calculateAmortization } from './lib/calculator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  DollarSign, 
  Percent, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Activity,
  Info
} from 'lucide-react';

function App() {
  const [balance, setBalance] = useState(298966636);
  const [rateEA, setRateEA] = useState(9.94);
  const [installment, setInstallment] = useState(4006551);
  const [insurance, setInsurance] = useState(247469);
  const [extraPayment, setExtraPayment] = useState(8393449);
  const [monthlyExtraPayment, setMonthlyExtraPayment] = useState(50000);
  const [strategy, setStrategy] = useState<'time' | 'installment'>('time');

  const baseScenario = useMemo(() =>
    calculateAmortization({ balance, rateEA, installment, insurance, extraPayment: 0, monthlyExtraPayment: 0 }, 'time'),
    [balance, rateEA, installment, insurance]);

  const timeScenario = useMemo(() =>
    calculateAmortization({ balance, rateEA, installment, insurance, extraPayment, monthlyExtraPayment }, 'time'),
    [balance, rateEA, installment, insurance, extraPayment, monthlyExtraPayment]);

  const installmentScenario = useMemo(() =>
    calculateAmortization({ balance, rateEA, installment, insurance, extraPayment, monthlyExtraPayment }, 'installment'),
    [balance, rateEA, installment, insurance, extraPayment, monthlyExtraPayment]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 0 
    }).format(val);

  const activeScenario = strategy === 'time' ? timeScenario : installmentScenario;

  // Combinar ambos escenarios para graficarlos juntos
  const chartData = useMemo(() => {
    const maxLength = Math.max(baseScenario.table.length, activeScenario.table.length);
    const data = [];
    for (let i = 0; i < maxLength; i++) {
      data.push({
        month: i + 1,
        "Saldo Base": baseScenario.table[i]?.balance ?? 0,
        "Saldo con Abono": activeScenario.table[i]?.balance ?? 0,
      });
    }
    return data;
  }, [baseScenario, activeScenario]);

  // Cálculos visuales innovadores
  const baseMonths = baseScenario.totalMonths;
  const newMonths = activeScenario.totalMonths;
  const monthsSaved = Math.max(0, baseMonths - newMonths);
  const savedMonthsPercentage = baseMonths > 0 ? (monthsSaved / baseMonths) * 100 : 0;

  const baseInterest = baseScenario.totalInterest;
  const newInterest = activeScenario.totalInterest;
  const interestSaved = Math.max(0, baseInterest - newInterest);
  const interestSavedPercentage = baseInterest > 0 ? (interestSaved / baseInterest) * 100 : 0;

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400 mb-2">{`Mes ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-6 justify-between text-xs mt-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="font-mono font-bold text-white">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          {payload.length > 1 && (
            <div className="border-t border-slate-800/80 mt-2 pt-2 flex justify-between text-[11px]">
              <span className="text-slate-400">Capital Liberado:</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatCurrency(Math.max(0, payload[0].value - payload[1].value))}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Simulador de Abonos a Capital
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Optimiza el plazo y los intereses de tu crédito hipotecario.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">Simulación Activa</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Parameters Panel */}
        <section className="lg:col-span-4 space-y-6">
          <Card className="border-slate-800/80 bg-slate-900/30 p-6 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="text-lg font-semibold text-white">Parámetros del Crédito</h2>
              <p className="text-xs text-slate-400 mt-1">Modifica los valores para recalcular el plan de pagos.</p>
            </div>

            {/* Inputs with Sliders */}
            <div className="space-y-5">
              
              {/* Saldo Actual */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    Saldo Actual ($)
                  </Label>
                  <span className="font-mono text-slate-300">{formatCurrency(balance)}</span>
                </div>
                <Input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="font-mono bg-slate-950 border-slate-800"
                />
                <input
                  type="range"
                  min={10000000}
                  max={1000000000}
                  step={5000000}
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Tasa EA */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-slate-300 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                    Tasa Efectiva Anual (%)
                  </Label>
                  <span className="font-mono text-slate-300">{rateEA.toFixed(2)}%</span>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  value={rateEA}
                  onChange={(e) => setRateEA(Number(e.target.value))}
                  className="font-mono bg-slate-950 border-slate-800"
                />
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={0.05}
                  value={rateEA}
                  onChange={(e) => setRateEA(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Cuota Actual */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-slate-300 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
                    Cuota Actual ($)
                  </Label>
                  <span className="font-mono text-slate-300">{formatCurrency(installment)}</span>
                </div>
                <Input
                  type="number"
                  value={installment}
                  onChange={(e) => setInstallment(Number(e.target.value))}
                  className="font-mono bg-slate-950 border-slate-800"
                />
                <input
                  type="range"
                  min={500000}
                  max={15000005}
                  step={50000}
                  value={installment}
                  onChange={(e) => setInstallment(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Seguros */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Seguros Mensuales ($)
                  </Label>
                  <span className="font-mono text-slate-300">{formatCurrency(insurance)}</span>
                </div>
                <Input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  className="font-mono bg-slate-950 border-slate-800"
                />
                <input
                  type="range"
                  min={0}
                  max={1500000}
                  step={5000}
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Abono Extra */}
              <div className="space-y-2 bg-emerald-950/10 p-3.5 rounded-xl border border-emerald-900/30">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Abono Extra Inmediato ($)
                  </Label>
                  <span className="font-mono text-emerald-400 font-bold">{formatCurrency(extraPayment)}</span>
                </div>
                <Input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                  className="font-mono bg-slate-950 border-emerald-900/40 text-emerald-400 focus-visible:ring-emerald-500"
                />
                <input
                  type="range"
                  min={0}
                  max={100000000}
                  step={500000}
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Abono Extra Mensual */}
              <div className="space-y-2 bg-emerald-950/15 p-3.5 rounded-xl border border-emerald-900/40">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Abono Extra Mensual ($)
                  </Label>
                  <span className="font-mono text-emerald-400 font-bold">{formatCurrency(monthlyExtraPayment)}</span>
                </div>
                <Input
                  type="number"
                  value={monthlyExtraPayment}
                  onChange={(e) => setMonthlyExtraPayment(Number(e.target.value))}
                  className="font-mono bg-slate-950 border-emerald-900/40 text-emerald-400 focus-visible:ring-emerald-500"
                />
                <input
                  type="range"
                  min={0}
                  max={5000000}
                  step={10000}
                  value={monthlyExtraPayment}
                  onChange={(e) => setMonthlyExtraPayment(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

            </div>
          </Card>
        </section>

        {/* Right Side: Results & Analytics */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Strategy Tabs */}
          <Tabs defaultValue="time" onValueChange={(val) => setStrategy(val as 'time' | 'installment')} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Reducción de Plazo (Recomendado)
              </TabsTrigger>
              <TabsTrigger value="installment" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Reducción de Cuota
              </TabsTrigger>
            </TabsList>

            {/* Metrics cards container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              <Card className="relative overflow-hidden">
                <div className="absolute right-3 top-3 text-slate-700/40">
                  <Calendar className="w-8 h-8" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {strategy === 'time' ? 'Nuevo Plazo' : 'Nueva Cuota'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white font-mono">
                    {strategy === 'time' 
                      ? `${activeScenario.totalMonths} meses`
                      : formatCurrency(activeScenario.table[0]?.payment || 0)
                    }
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Proyección estimada</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-emerald-900/30 bg-emerald-950/5">
                <div className="absolute right-3 top-3 text-emerald-500/10">
                  <TrendingDown className="w-8 h-8" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    {strategy === 'time' ? 'Tiempo Ahorrado' : 'Alivio Mensual'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">
                    {strategy === 'time' 
                      ? `${monthsSaved} meses`
                      : formatCurrency(Math.max(0, installment - (activeScenario.table[0]?.payment || 0)))
                    }
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Beneficio inmediato</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-emerald-900/30 bg-emerald-950/5">
                <div className="absolute right-3 top-3 text-emerald-500/10">
                  <DollarSign className="w-8 h-8" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Intereses Evitados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">
                    {formatCurrency(interestSaved)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {interestSavedPercentage.toFixed(1)}% del total original
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Innovative Value Presentation Visuals */}
            <Card className="p-6 mb-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Info className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">Comparación de Rendimiento</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Timeline Visual Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Línea de Tiempo del Crédito</span>
                    <span className="text-emerald-400 font-medium">-{monthsSaved} meses ({savedMonthsPercentage.toFixed(0)}% más rápido)</span>
                  </div>
                  <div className="relative w-full h-5 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                    <div 
                      style={{ width: `${100 - savedMonthsPercentage}%` }} 
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-500" 
                    />
                    {monthsSaved > 0 && (
                      <div 
                        style={{ width: `${savedMonthsPercentage}%` }} 
                        className="h-full bg-transparent flex items-center justify-center text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-wide animate-pulse"
                      >
                        Abonado
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>Inicio</span>
                    <span>Nuevo Plazo: {newMonths}m</span>
                    <span>Plazo Original: {baseMonths}m</span>
                  </div>
                </div>

                {/* Interest Saved Progress Circle/Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Distribución de Intereses Totales</span>
                    <span className="text-emerald-400 font-medium">Ahorro: {interestSavedPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-5 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                    <div 
                      style={{ width: `${100 - interestSavedPercentage}%` }} 
                      className="h-full bg-slate-800 rounded-full transition-all duration-500" 
                    />
                    <div 
                      style={{ width: `${interestSavedPercentage}%` }} 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Nuevo Total: {formatCurrency(newInterest)}</span>
                    <span className="text-emerald-400 font-semibold">Ahorrado</span>
                  </div>
                </div>

              </div>
            </Card>

            {/* Amortization Chart */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Proyección del Saldo de la Hipoteca</h3>
                  <p className="text-xs text-slate-500">Comparativa de reducción de deuda mes a mes.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-1.5 bg-slate-700 rounded-full" />
                    Escenario Base
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-1.5 bg-emerald-500 rounded-full" />
                    Con Abono Extra
                  </span>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#475569" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#475569" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value / 1000000}M`}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="Saldo Base" 
                      stroke="#475569" 
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorBase)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Saldo con Abono" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorNew)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Tabla de Proyección Detallada */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Tabla de Amortización Detallada</h3>
                  <p className="text-xs text-slate-500">Proyección cuota a cuota para el escenario actual.</p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <div>
                    Saldo Inicial: <span className="text-white font-bold">{formatCurrency(balance)}</span>
                  </div>
                  <div>
                    Meses Totales: <span className="text-white font-bold">{activeScenario.totalMonths}</span>
                  </div>
                  <div>
                    Años Estimados: <span className="text-white font-bold">{(activeScenario.totalMonths / 12).toFixed(1)}</span>
                  </div>
                  <div>
                    Intereses Totales: <span className="text-emerald-400 font-bold">{formatCurrency(activeScenario.totalInterest)}</span>
                  </div>
                </div>
              </div>

              <div className="relative rounded-lg border border-slate-800 overflow-hidden">
                <div className="max-h-[350px] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-medium select-none z-10">
                        <th className="p-3 font-semibold">Mes</th>
                        <th className="p-3 font-semibold text-right">Pago Total</th>
                        <th className="p-3 font-semibold text-right">Intereses</th>
                        <th className="p-3 font-semibold text-right">Abono Capital</th>
                        <th className="p-3 font-semibold text-right">Abono Extra</th>
                        <th className="p-3 font-semibold text-right">Seguros</th>
                        <th className="p-3 font-semibold text-right">Saldo Restante</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-950/20 font-mono">
                      {/* Fila Mes 0 */}
                      <tr className="hover:bg-slate-900/40 transition-colors text-slate-400/80">
                        <td className="p-3 font-medium text-slate-500">0</td>
                        <td className="p-3 text-right">{formatCurrency(extraPayment)}</td>
                        <td className="p-3 text-right">$0</td>
                        <td className="p-3 text-right">$0</td>
                        <td className="p-3 text-right text-emerald-400 font-medium">{formatCurrency(extraPayment)}</td>
                        <td className="p-3 text-right">$0</td>
                        <td className="p-3 text-right text-slate-300 font-bold">{formatCurrency(balance - extraPayment)}</td>
                      </tr>
                      {/* Filas de la tabla */}
                      {activeScenario.table.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 text-slate-400 font-medium">{row.month}</td>
                          <td className="p-3 text-right text-slate-200">{formatCurrency(row.payment)}</td>
                          <td className="p-3 text-right text-slate-300">{formatCurrency(row.interest)}</td>
                          <td className="p-3 text-right text-slate-400">{formatCurrency(row.principal)}</td>
                          <td className="p-3 text-right text-emerald-400/90">{formatCurrency(row.extraPrincipal)}</td>
                          <td className="p-3 text-right text-slate-400">{formatCurrency(row.insurance)}</td>
                          <td className="p-3 text-right text-slate-200 font-medium">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

          </Tabs>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Simulador de Abonos a Capital - Optimización Financiera Hipotecaria</p>
      </footer>

    </div>
  );
}

export default App;