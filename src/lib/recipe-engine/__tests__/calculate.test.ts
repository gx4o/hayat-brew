import { describe, expect, it } from "vitest";
import { calculateRecipe } from "../calculate";
import { coffeeMachineHot, coffeeMachineIced, cup, mug, v60Hot, v60Iced } from "./fixtures";

describe("ماكينة القهوة — حارة", () => {
  it("3 أكواب → 37.5 جم بن، 600 مل موية", () => {
    const r = calculateRecipe({ recipe: coffeeMachineHot, servingUnit: cup, quantity: 3 });
    expect(r.coffeeGrams).toBe(37.5);
    expect(r.waterMl).toBe(600);
    expect(r.serverIceGrams).toBeNull();
  });

  it("كوب واحد → 12.5 جم، 200 مل", () => {
    const r = calculateRecipe({ recipe: coffeeMachineHot, servingUnit: cup, quantity: 1 });
    expect(r.coffeeGrams).toBe(12.5);
    expect(r.waterMl).toBe(200);
  });

  it("نصف كوب → 6.25 جم، 100 مل", () => {
    const r = calculateRecipe({ recipe: coffeeMachineHot, servingUnit: cup, quantity: 0.5 });
    expect(r.coffeeGrams).toBe(6.25);
    expect(r.waterMl).toBe(100);
  });

  it("مق واحد (323 مل) بنسبة 1:16 → 20.2 جم تقريباً", () => {
    const r = calculateRecipe({ recipe: coffeeMachineHot, servingUnit: mug, quantity: 1 });
    expect(r.waterMl).toBe(323);
    expect(r.coffeeGrams).toBe(20.2); // exact 20.1875
  });

  it("الكميات الكبيرة تتوسع خطياً (8 أكواب)", () => {
    const r = calculateRecipe({ recipe: coffeeMachineHot, servingUnit: cup, quantity: 8 });
    expect(r.coffeeGrams).toBe(100);
    expect(r.waterMl).toBe(1600);
  });
});

describe("ماكينة القهوة — باردة", () => {
  // ثلج السيرفر = الكمية × 57.5 جم، معروض لأقرب 5 جم
  const cases: Array<[number, number, number, number]> = [
    // [quantity, coffee, water, serverIce]
    [1, 12.5, 100, 60],
    [2, 25, 200, 115],
    [3, 37.5, 300, 175],
    [3.5, 43.75, 350, 200],
    [4, 50, 400, 230],
    [5, 62.5, 500, 290],
  ];

  it.each(cases)("%s كوب → %s جم بن، %s مل موية، %s جم ثلج سيرفر", (qty, coffee, water, ice) => {
    const r = calculateRecipe({ recipe: coffeeMachineIced, servingUnit: cup, quantity: qty });
    expect(r.coffeeGrams).toBe(coffee);
    expect(r.waterMl).toBe(water);
    expect(r.serverIceGrams).toBe(ice);
  });

  it("يعرض ملاحظة ثلج التقديم ويميّزها عن ثلج السيرفر", () => {
    const r = calculateRecipe({ recipe: coffeeMachineIced, servingUnit: cup, quantity: 2 });
    expect(r.servingIceNoteAr).toBe("ثلج إضافي في الأكواب وقت التقديم");
    const serverIce = r.ingredients.find((i) => i.ingredientSlug === "server_ice");
    expect(serverIce?.nameAr).toBe("ثلج السيرفر");
  });

  it("وضع المق يتوسع نسبياً على أساس 323 مل", () => {
    const r = calculateRecipe({ recipe: coffeeMachineIced, servingUnit: mug, quantity: 1 });
    // scale = 323/200 = 1.615
    expect(r.coffeeGrams).toBe(20.2); // 12.5 × 1.615 = 20.1875
    expect(r.waterMl).toBe(162); // 100 × 1.615 = 161.5
    expect(r.serverIceGrams).toBe(95); // 57.5 × 1.615 = 92.86 → أقرب 5
  });
});

describe("V60 — حارة", () => {
  it("كوبان → 25 جم بن، 400 مل موية", () => {
    const r = calculateRecipe({ recipe: v60Hot, servingUnit: cup, quantity: 2 });
    expect(r.coffeeGrams).toBe(25);
    expect(r.waterMl).toBe(400);
  });

  it("3 أكواب → 37.5 جم بن، 600 مل موية", () => {
    const r = calculateRecipe({ recipe: v60Hot, servingUnit: cup, quantity: 3 });
    expect(r.coffeeGrams).toBe(37.5);
    expect(r.waterMl).toBe(600);
  });

  it("الحرارة 92–94 وملاحظتا التحميص والطحنة", () => {
    const r = calculateRecipe({ recipe: v60Hot, servingUnit: cup, quantity: 1 });
    expect(r.temperature?.label).toBe("92–94°C");
    expect(r.lightRoastNoteAr).toContain("94–96");
    expect(r.grindNoteAr).toContain("متوسطة");
  });

  it("موية الترطيب ≈ ضعف وزن البن", () => {
    const r = calculateRecipe({ recipe: v60Hot, servingUnit: cup, quantity: 2 });
    expect(r.bloomWaterMl).toBe(50); // 25 جم × 2
    expect(r.bloomSeconds).toEqual({ min: 30, max: 45 });
  });
});

describe("V60 — باردة", () => {
  const cases: Array<[number, number, number, number]> = [
    [1, 12.5, 100, 100],
    [1.5, 18.75, 150, 150],
    [2, 25, 200, 200],
    [2.5, 31.25, 250, 250],
    [3, 37.5, 300, 300],
  ];

  it.each(cases)("%s كوب → %s جم بن، %s مل موية، %s جم ثلج", (qty, coffee, water, ice) => {
    const r = calculateRecipe({ recipe: v60Iced, servingUnit: cup, quantity: qty });
    expect(r.coffeeGrams).toBe(coffee);
    expect(r.waterMl).toBe(water);
    expect(r.serverIceGrams).toBe(ice);
  });

  it("مراحل الصب التراكمية لكوبين: 125 ثم 200 مل (مثال المواصفات)", () => {
    const r = calculateRecipe({ recipe: v60Iced, servingUnit: cup, quantity: 2 });
    expect(r.pourStages.map((s) => s.cumulativeTargetMl)).toEqual([125, 200]);
  });

  it("مراحل الصب تتوسع ديناميكياً (3 أكواب: 190 ثم 300)", () => {
    const r = calculateRecipe({ recipe: v60Iced, servingUnit: cup, quantity: 3 });
    // 300 × 0.625 = 187.5 → أقرب 5 = 190، والمرحلة الأخيرة = إجمالي الموية
    expect(r.pourStages.map((s) => s.cumulativeTargetMl)).toEqual([190, 300]);
  });

  it("النصوص تُحل ديناميكياً داخل خطوات التحضير", () => {
    const r = calculateRecipe({ recipe: v60Iced, servingUnit: cup, quantity: 2 });
    const texts = r.steps.map((s) => s.instructionAr);
    expect(texts[0]).toBe("حط 200 جرام ثلج في السيرفر");
    expect(texts[1]).toBe("أضف 25 جرام بن مطحون طحنة متوسطة");
    expect(texts[2]).toBe("صب 50 مل موية على البن");
    expect(texts[4]).toBe("صب حتى يوصل إجمالي الموية إلى 125 مل");
    expect(texts[5]).toBe("كمّل الصب حتى يوصل إجمالي الموية إلى 200 مل");
  });

  it("وضع المق: الحجم الكلي المستهدف = الكمية × 323 مل", () => {
    const r = calculateRecipe({ recipe: v60Iced, servingUnit: mug, quantity: 1.5 });
    expect(r.totalVolumeMl).toBe(485); // 323 × 1.5 = 484.5
    expect(r.waterMl).toBe(242); // نصف الحجم موية
    expect(r.serverIceGrams).toBe(240); // ونصفه ثلج، لأقرب 5
  });
});

describe("قواعد عامة", () => {
  it("يرفض الكمية الأقل من 0.5", () => {
    expect(() =>
      calculateRecipe({ recipe: v60Hot, servingUnit: cup, quantity: 0.4 })
    ).toThrow();
    expect(() =>
      calculateRecipe({ recipe: v60Hot, servingUnit: cup, quantity: 0 })
    ).toThrow();
  });

  it("كوب ≠ مق: نفس الوصفة تعطي أرقاماً مختلفة", () => {
    const cupResult = calculateRecipe({ recipe: v60Hot, servingUnit: cup, quantity: 1 });
    const mugResult = calculateRecipe({ recipe: v60Hot, servingUnit: mug, quantity: 1 });
    expect(cupResult.waterMl).toBe(200);
    expect(mugResult.waterMl).toBe(323);
    expect(cupResult.coffeeGrams).not.toBe(mugResult.coffeeGrams);
  });

  it("لا يعتمد على ترتيب الخطوات في المصفوفة", () => {
    const shuffled = { ...v60Iced, steps: [...v60Iced.steps].reverse() };
    const r = calculateRecipe({ recipe: shuffled, servingUnit: cup, quantity: 2 });
    expect(r.steps[0].stepNumber).toBe(1);
    expect(r.pourStages.map((s) => s.cumulativeTargetMl)).toEqual([125, 200]);
  });
});
