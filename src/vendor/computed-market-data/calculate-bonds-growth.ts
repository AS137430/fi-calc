export default function calculateBondsGrowth({
  currentYearLir,
  nextYearLir,
}: {
  currentYearLir: number;
  nextYearLir: number;
}): number {
  let bondsGrowth = 0;
  if (typeof nextYearLir === 'number') {
    // Source:
    // https://www.bogleheads.org/forum/viewtopic.php?f=10&t=130068#p1914647
    // The variable names come from the values used in that post

    // From the post:

    // "(PVA$1) represents the present value of $1 to be received at the end of each year for 10 years."
    // pva1 = "Present value of $1, annual"
    const pva1 = (1 - Math.pow(1 + nextYearLir, -9)) / nextYearLir;
    var firstTerm = currentYearLir * pva1;
    // "Part of the formula (PV$1) represents the present value of $1 to be received in 10 years."
    // pv1 = present value of $1
    const pv1 = 1 / Math.pow(1 + nextYearLir, 9) - 1;

    // Also of note from the post:
    //  Since (1+NYIR)^-10 is equivalent to 1/((1+NYIR)^10), PVA$1 can be expressed as (1 - PV$1) / NYIR.

    const secondTerm = pv1 + currentYearLir;
    bondsGrowth = firstTerm + secondTerm;
  } else {
    bondsGrowth = currentYearLir;
  }

  return bondsGrowth;
}
