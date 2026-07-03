// Test fixtures mirroring supabase/migrations/20260703150100_seed_family_recipes.sql
// If the seed data changes, update these to match.
import type { Recipe, ServingUnit } from "../types";

export const cup: ServingUnit = { slug: "cup", nameAr: "كوب", volumeMl: 200 };
export const mug: ServingUnit = { slug: "mug", nameAr: "مق", volumeMl: 323 };

const noBrewNotes = {
  tempMinC: null,
  tempMaxC: null,
  lightRoastNoteAr: null,
  grindNoteAr: null,
  bloomWaterMultiplier: null,
  bloomSecondsMin: null,
  bloomSecondsMax: null,
  estimatedBrewSeconds: null,
};

export const coffeeMachineHot: Recipe = {
  slug: "coffee-machine-hot",
  style: "hot",
  nameAr: "ماكينة القهوة — حارة",
  referenceVolumeMl: 200,
  servingIceNoteAr: null,
  ...noBrewNotes,
  ingredients: [
    { ingredientSlug: "coffee", nameAr: "بن", unit: "g", amountPerServing: 12.5, sortOrder: 1 },
    { ingredientSlug: "water", nameAr: "موية", unit: "ml", amountPerServing: 200, sortOrder: 2 },
  ],
  steps: [
    { stepNumber: 1, titleAr: "ركّب الفلتر", instructionAr: "ركّب الفلتر في مكانه", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 2, titleAr: "أضف البن", instructionAr: "أضف {coffee_g} جرام بن في الفلتر", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 3, titleAr: "أضف الموية", instructionAr: "عبّي خزان الماكينة بـ {water_ml} مل موية", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 4, titleAr: "شغّل الماكينة", instructionAr: "شغّل الماكينة وخلّ التحضير يبدأ", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 5, titleAr: "انتظر", instructionAr: "انتظر حتى يكتمل التحضير", timerSeconds: null, cumulativeWaterFraction: null },
  ],
};

export const coffeeMachineIced: Recipe = {
  slug: "coffee-machine-iced",
  style: "iced",
  nameAr: "ماكينة القهوة — باردة",
  referenceVolumeMl: 200,
  servingIceNoteAr: "ثلج إضافي في الأكواب وقت التقديم",
  ...noBrewNotes,
  ingredients: [
    { ingredientSlug: "coffee", nameAr: "بن", unit: "g", amountPerServing: 12.5, sortOrder: 1 },
    { ingredientSlug: "water", nameAr: "موية", unit: "ml", amountPerServing: 100, sortOrder: 2 },
    { ingredientSlug: "server_ice", nameAr: "ثلج السيرفر", unit: "g", amountPerServing: 57.5, sortOrder: 3 },
  ],
  steps: [
    { stepNumber: 1, titleAr: "ثلج السيرفر", instructionAr: "حط {server_ice_g} جرام ثلج في السيرفر", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 2, titleAr: "أضف البن", instructionAr: "أضف {coffee_g} جرام بن في الفلتر", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 3, titleAr: "أضف الموية", instructionAr: "عبّي خزان الماكينة بـ {water_ml} مل موية", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 4, titleAr: "شغّل الماكينة", instructionAr: "شغّل الماكينة وخلّ القهوة تنزل على ثلج السيرفر مباشرة", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 5, titleAr: "حرّك السيرفر", instructionAr: "حرّك السيرفر بهدوء حتى تمتزج القهوة مع الثلج", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 6, titleAr: "ثلج التقديم", instructionAr: "حط ثلج تقديم طازج في الأكواب", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 7, titleAr: "قدّم", instructionAr: "صب القهوة وقدّمها", timerSeconds: null, cumulativeWaterFraction: null },
  ],
};

export const v60Hot: Recipe = {
  slug: "v60-hot",
  style: "hot",
  nameAr: "V60 — حارة",
  referenceVolumeMl: 200,
  tempMinC: 92,
  tempMaxC: 94,
  lightRoastNoteAr: "للتحميص الفاتح: 94–96°C",
  grindNoteAr: "طحنة متوسطة مناسبة للـ V60",
  servingIceNoteAr: null,
  bloomWaterMultiplier: 2,
  bloomSecondsMin: 30,
  bloomSecondsMax: 45,
  estimatedBrewSeconds: 180,
  ingredients: [
    { ingredientSlug: "coffee", nameAr: "بن", unit: "g", amountPerServing: 12.5, sortOrder: 1 },
    { ingredientSlug: "water", nameAr: "موية", unit: "ml", amountPerServing: 200, sortOrder: 2 },
  ],
  steps: [
    { stepNumber: 1, titleAr: "اشطف الفلتر", instructionAr: "حط الفلتر في الـ V60 واشطفه بموية حارة، ثم كب موية الشطف", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 2, titleAr: "أضف البن", instructionAr: "أضف {coffee_g} جرام بن مطحون طحنة متوسطة", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 3, titleAr: "الترطيب", instructionAr: "صب {bloom_water_ml} مل موية على البن", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 4, titleAr: "انتظار الترطيب", instructionAr: "انتظر 30–45 ثانية", timerSeconds: 40, cumulativeWaterFraction: null },
    { stepNumber: 5, titleAr: "الصبة الأولى", instructionAr: "صب حتى يوصل إجمالي الموية إلى {stage_water_ml} مل", timerSeconds: null, cumulativeWaterFraction: 0.6 },
    { stepNumber: 6, titleAr: "كمّل الصب", instructionAr: "كمّل الصب حتى يوصل إجمالي الموية إلى {total_water_ml} مل", timerSeconds: null, cumulativeWaterFraction: 1.0 },
    { stepNumber: 7, titleAr: "التنقيط", instructionAr: "انتظر حتى تخلص الموية من الفلتر", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 8, titleAr: "قدّم", instructionAr: "صب القهوة وقدّمها", timerSeconds: null, cumulativeWaterFraction: null },
  ],
};

export const v60Iced: Recipe = {
  slug: "v60-iced",
  style: "iced",
  nameAr: "V60 — باردة",
  referenceVolumeMl: 200,
  tempMinC: 92,
  tempMaxC: 94,
  lightRoastNoteAr: null,
  grindNoteAr: "طحنة متوسطة مناسبة للـ V60",
  servingIceNoteAr: null,
  bloomWaterMultiplier: 2,
  bloomSecondsMin: 30,
  bloomSecondsMax: 45,
  estimatedBrewSeconds: 180,
  ingredients: [
    { ingredientSlug: "coffee", nameAr: "بن", unit: "g", amountPerServing: 12.5, sortOrder: 1 },
    { ingredientSlug: "water", nameAr: "موية", unit: "ml", amountPerServing: 100, sortOrder: 2 },
    { ingredientSlug: "server_ice", nameAr: "ثلج", unit: "g", amountPerServing: 100, sortOrder: 3 },
  ],
  steps: [
    { stepNumber: 1, titleAr: "ثلج السيرفر", instructionAr: "حط {server_ice_g} جرام ثلج في السيرفر", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 2, titleAr: "أضف البن", instructionAr: "أضف {coffee_g} جرام بن مطحون طحنة متوسطة", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 3, titleAr: "الترطيب", instructionAr: "صب {bloom_water_ml} مل موية على البن", timerSeconds: null, cumulativeWaterFraction: null },
    { stepNumber: 4, titleAr: "انتظار الترطيب", instructionAr: "انتظر 30–45 ثانية", timerSeconds: 40, cumulativeWaterFraction: null },
    { stepNumber: 5, titleAr: "الصبة الأولى", instructionAr: "صب حتى يوصل إجمالي الموية إلى {stage_water_ml} مل", timerSeconds: null, cumulativeWaterFraction: 0.625 },
    { stepNumber: 6, titleAr: "كمّل الصب", instructionAr: "كمّل الصب حتى يوصل إجمالي الموية إلى {total_water_ml} مل", timerSeconds: null, cumulativeWaterFraction: 1.0 },
    { stepNumber: 7, titleAr: "حرّك السيرفر", instructionAr: "حرّك السيرفر بهدوء حتى تمتزج القهوة مع الثلج، ثم صبها وقدّمها", timerSeconds: null, cumulativeWaterFraction: null },
  ],
};
