/** Natural Arabic quantity phrases: كوبين، 3 أكواب ونص، مق واحد… */
export function formatQuantityAr(quantity: number, unitSlug: string): string {
  const whole = Math.floor(quantity);
  const hasHalf = quantity - whole >= 0.25; // quantities step by 0.5

  const forms =
    unitSlug === "cup"
      ? { one: "كوب", two: "كوبين", few: "أكواب", many: "كوب" }
      : { one: "مق", two: "مقين", few: "مق", many: "مق" };

  let base: string;
  if (whole === 0) return hasHalf ? `نص ${forms.one}` : `0 ${forms.one}`;
  if (whole === 1) base = hasHalf ? forms.one : `${forms.one} واحد`;
  else if (whole === 2) base = forms.two;
  else if (whole <= 10) base = `${whole} ${forms.few}`;
  else base = `${whole} ${forms.many}`;

  return hasHalf ? `${base} ونص` : base;
}
