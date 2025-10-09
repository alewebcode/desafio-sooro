export function classifyBMI(imc: number): string {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade grau I';
  if (imc < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}
export function calculateBMI(weight: number, height: number): number {
  return parseFloat((weight / (height * height)).toFixed(2));
}
