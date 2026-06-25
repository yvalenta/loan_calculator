export interface AmortizationParams {
  balance: number;
  rateEA: number;
  installment: number;
  insurance: number;
  extraPayment: number;
  monthlyExtraPayment: number;
}

export interface MonthData {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  extraPrincipal: number;
  insurance: number;
  balance: number;
}

export interface ScenarioResult {
  table: MonthData[];
  totalMonths: number;
  totalInterest: number;
}

const calculateMonthlyRate = (rateEA: number) => Math.pow(1 + rateEA / 100, 1 / 12) - 1;

export const calculateAmortization = (
  params: AmortizationParams, 
  strategy: 'time' | 'installment'
): ScenarioResult => {
  let currentBalance = params.balance;
  const monthlyRate = calculateMonthlyRate(params.rateEA);
  const table: MonthData[] = [];
  let totalInterest = 0;
  let month = 0;

  // Se aplica el abono extra único al capital inicial
  currentBalance = Math.max(0, currentBalance - params.extraPayment);

  let originalMonthsRemaining = 0;

  // Si reducimos cuota, necesitamos proyectar el plazo original sobre el saldo actual
  if (strategy === 'installment') {
    let tempBalance = params.balance;
    while (tempBalance > 0.01 && originalMonthsRemaining < 480) { // Límite de 40 años de seguridad
      originalMonthsRemaining++;
      const interest = tempBalance * monthlyRate;
      const principal = params.installment - interest - params.insurance;
      tempBalance -= Math.max(0, principal);
    }
  }

  let activeInstallment = params.installment;

  // Recalcular la nueva cuota para el saldo restante manteniendo el plazo
  if (strategy === 'installment' && currentBalance > 0 && originalMonthsRemaining > 0) {
    const rateFactor = Math.pow(1 + monthlyRate, originalMonthsRemaining);
    const pureInstallment = (currentBalance * monthlyRate * rateFactor) / (rateFactor - 1);
    activeInstallment = pureInstallment + params.insurance;
  }

  // Generar la tabla de amortización
  while (currentBalance > 0.01 && month < 480) {
    month++;
    const interest = currentBalance * monthlyRate;
    let regularPrincipal = activeInstallment - interest - params.insurance;

    // Evitar valores negativos si la cuota no cubre los intereses + seguros
    regularPrincipal = Math.max(0, regularPrincipal);

    let extraPrincipal = params.monthlyExtraPayment;

    // Ajustes para el último mes o saldo remanente menor
    if (currentBalance < regularPrincipal) {
      regularPrincipal = currentBalance;
      extraPrincipal = 0;
      activeInstallment = regularPrincipal + interest + params.insurance;
    } else if (currentBalance < regularPrincipal + extraPrincipal) {
      extraPrincipal = currentBalance - regularPrincipal;
    }

    currentBalance -= (regularPrincipal + extraPrincipal);
    totalInterest += interest;

    table.push({
      month,
      payment: activeInstallment + extraPrincipal,
      interest,
      principal: regularPrincipal,
      extraPrincipal: extraPrincipal,
      insurance: params.insurance,
      balance: Math.max(0, currentBalance)
    });
  }

  return { table, totalMonths: month, totalInterest };
};