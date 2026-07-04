import type { StaticImageData } from "next/image";
import coffeeMachine from "@/assets/illustrations/coffee-machine.webp";
import cup from "@/assets/illustrations/cup.webp";
import hotCoffee from "@/assets/illustrations/hot-coffee.webp";
import icedCoffee from "@/assets/illustrations/iced-coffee.webp";
import mug from "@/assets/illustrations/mug.webp";
import readyHot from "@/assets/illustrations/ready-hot.webp";
import readyIced from "@/assets/illustrations/ready-iced.webp";
import stepAddCoffee from "@/assets/illustrations/step-add-coffee.webp";
import stepBloom from "@/assets/illustrations/step-bloom.webp";
import stepFinalPour from "@/assets/illustrations/step-final-pour.webp";
import stepFirstPour from "@/assets/illustrations/step-first-pour.webp";
import stepServerIce from "@/assets/illustrations/step-server-ice.webp";
import stepSwirl from "@/assets/illustrations/step-swirl.webp";
import v60 from "@/assets/illustrations/v60.webp";

export interface Illustration {
  src: StaticImageData;
  /** The artwork's own background color — media areas use it so the image blends seamlessly. */
  canvas: string;
}

export const ART = {
  "coffee-machine": { src: coffeeMachine, canvas: "#fdf9f3" },
  v60: { src: v60, canvas: "#fbf3e8" },
  "hot-coffee": { src: hotCoffee, canvas: "#fcf1df" },
  "iced-coffee": { src: icedCoffee, canvas: "#fdf3e7" },
  cup: { src: cup, canvas: "#fdf5e9" },
  mug: { src: mug, canvas: "#fdf8ec" },
  "step-server-ice": { src: stepServerIce, canvas: "#fef8eb" },
  "step-add-coffee": { src: stepAddCoffee, canvas: "#fef7eb" },
  "step-bloom": { src: stepBloom, canvas: "#fdf8ed" },
  "step-first-pour": { src: stepFirstPour, canvas: "#fef8ed" },
  "step-final-pour": { src: stepFinalPour, canvas: "#fef7ed" },
  "step-swirl": { src: stepSwirl, canvas: "#fdf7ed" },
  "ready-hot": { src: readyHot, canvas: "#fdf8f0" },
  "ready-iced": { src: readyIced, canvas: "#fef7eb" },
} satisfies Record<string, Illustration>;

export type ArtKey = keyof typeof ART;

/**
 * Picks the most meaningful illustration for a guided-brewing step from its
 * Arabic title. Trivial steps fall back to the equipment artwork — the spec
 * asks for large step illustrations only where the image helps the action.
 */
export function artForStep(titleAr: string, equipmentSlug: string): ArtKey {
  if (titleAr.includes("ثلج السيرفر")) return "step-server-ice";
  if (titleAr.includes("ثلج التقديم")) return "iced-coffee";
  if (titleAr.includes("بن")) return "step-add-coffee";
  if (titleAr.includes("ترطيب")) return "step-bloom";
  if (titleAr.includes("الصبة الأولى")) return "step-first-pour";
  if (titleAr.includes("كمّل")) return "step-final-pour";
  if (titleAr.includes("حرّك")) return "step-swirl";
  return equipmentSlug === "v60" ? "v60" : "coffee-machine";
}
