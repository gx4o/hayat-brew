-- Hayat Brew — seed the four family recipes.
-- Amounts are exact per one reference serving (1 كوب = 200 ml);
-- display rounding happens in the TypeScript engine, never here.

insert into public.equipment (slug, name_ar, subtitle_ar, sort_order) values
  ('coffee-machine', 'ماكينة القهوة', 'تحضير تلقائي', 1),
  ('v60', 'V60', 'تحضير يدوي', 2);

insert into public.serving_units (slug, name_ar, quantity_question_ar, volume_ml, sort_order) values
  ('cup', 'كوب', 'كم كوب بتسوي؟', 200, 1),
  ('mug', 'مق', 'كم مق بتسوي؟', 323, 2);

insert into public.recipes
  (slug, equipment_id, style, name_ar, description_ar, ratio_label,
   reference_volume_ml, temp_min_c, temp_max_c,
   light_roast_note_ar, grind_note_ar, serving_ice_note_ar,
   bloom_water_multiplier, bloom_seconds_min, bloom_seconds_max,
   estimated_brew_seconds, sort_order)
values
  ('coffee-machine-hot',
   (select id from public.equipment where slug = 'coffee-machine'),
   'hot', 'ماكينة القهوة — حارة', 'تحضير تلقائي بنسبة 1:16', '1:16',
   200, null, null, null, null, null, null, null, null, null, 1),

  ('coffee-machine-iced',
   (select id from public.equipment where slug = 'coffee-machine'),
   'iced', 'ماكينة القهوة — باردة', 'قهوة باردة تنزل مباشرة على ثلج السيرفر', '1:8 + ثلج',
   200, null, null, null, null,
   'ثلج إضافي في الأكواب وقت التقديم',
   null, null, null, null, 2),

  ('v60-hot',
   (select id from public.equipment where slug = 'v60'),
   'hot', 'V60 — حارة', 'تحضير يدوي بنسبة 1:16', '1:16',
   200, 92, 94,
   'للتحميص الفاتح: 94–96°C',
   'طحنة متوسطة مناسبة للـ V60',
   null, 2, 30, 45, 180, 3),

  ('v60-iced',
   (select id from public.equipment where slug = 'v60'),
   'iced', 'V60 — باردة', 'تحضير يدوي على ثلج مباشرة', '1:8 + ثلج',
   200, 92, 94, null,
   'طحنة متوسطة مناسبة للـ V60',
   null, 2, 30, 45, 180, 4);

insert into public.recipe_ingredients
  (recipe_id, ingredient_slug, name_ar, unit, amount_per_serving, sort_order)
values
  -- ماكينة القهوة — حارة: لكل كوب 200 مل موية، بن = الموية ÷ 16
  ((select id from public.recipes where slug = 'coffee-machine-hot'), 'coffee', 'بن', 'g', 12.5, 1),
  ((select id from public.recipes where slug = 'coffee-machine-hot'), 'water', 'موية', 'ml', 200, 2),

  -- ماكينة القهوة — باردة: لكل كوب 12.5 بن + 100 موية + 57.5 ثلج سيرفر
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 'coffee', 'بن', 'g', 12.5, 1),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 'water', 'موية', 'ml', 100, 2),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 'server_ice', 'ثلج السيرفر', 'g', 57.5, 3),

  -- V60 — حارة
  ((select id from public.recipes where slug = 'v60-hot'), 'coffee', 'بن', 'g', 12.5, 1),
  ((select id from public.recipes where slug = 'v60-hot'), 'water', 'موية', 'ml', 200, 2),

  -- V60 — باردة: لكل كوب 12.5 بن + 100 موية + 100 ثلج
  ((select id from public.recipes where slug = 'v60-iced'), 'coffee', 'بن', 'g', 12.5, 1),
  ((select id from public.recipes where slug = 'v60-iced'), 'water', 'موية', 'ml', 100, 2),
  ((select id from public.recipes where slug = 'v60-iced'), 'server_ice', 'ثلج', 'g', 100, 3);

insert into public.recipe_steps
  (recipe_id, step_number, title_ar, instruction_ar, timer_seconds, cumulative_water_fraction)
values
  -- ماكينة القهوة — حارة
  ((select id from public.recipes where slug = 'coffee-machine-hot'), 1, 'ركّب الفلتر', 'ركّب الفلتر في مكانه', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-hot'), 2, 'أضف البن', 'أضف {coffee_g} جرام بن في الفلتر', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-hot'), 3, 'أضف الموية', 'عبّي خزان الماكينة بـ {water_ml} مل موية', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-hot'), 4, 'شغّل الماكينة', 'شغّل الماكينة وخلّ التحضير يبدأ', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-hot'), 5, 'انتظر', 'انتظر حتى يكتمل التحضير', null, null),

  -- ماكينة القهوة — باردة
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 1, 'ثلج السيرفر', 'حط {server_ice_g} جرام ثلج في السيرفر', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 2, 'أضف البن', 'أضف {coffee_g} جرام بن في الفلتر', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 3, 'أضف الموية', 'عبّي خزان الماكينة بـ {water_ml} مل موية', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 4, 'شغّل الماكينة', 'شغّل الماكينة وخلّ القهوة تنزل على ثلج السيرفر مباشرة', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 5, 'حرّك السيرفر', 'حرّك السيرفر بهدوء حتى تمتزج القهوة مع الثلج', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 6, 'ثلج التقديم', 'حط ثلج تقديم طازج في الأكواب', null, null),
  ((select id from public.recipes where slug = 'coffee-machine-iced'), 7, 'قدّم', 'صب القهوة وقدّمها', null, null),

  -- V60 — حارة
  ((select id from public.recipes where slug = 'v60-hot'), 1, 'اشطف الفلتر', 'حط الفلتر في الـ V60 واشطفه بموية حارة، ثم كب موية الشطف', null, null),
  ((select id from public.recipes where slug = 'v60-hot'), 2, 'أضف البن', 'أضف {coffee_g} جرام بن مطحون طحنة متوسطة', null, null),
  ((select id from public.recipes where slug = 'v60-hot'), 3, 'الترطيب', 'صب {bloom_water_ml} مل موية على البن', null, null),
  ((select id from public.recipes where slug = 'v60-hot'), 4, 'انتظار الترطيب', 'انتظر 30–45 ثانية', 40, null),
  ((select id from public.recipes where slug = 'v60-hot'), 5, 'الصبة الأولى', 'صب حتى يوصل إجمالي الموية إلى {stage_water_ml} مل', null, 0.6),
  ((select id from public.recipes where slug = 'v60-hot'), 6, 'كمّل الصب', 'كمّل الصب حتى يوصل إجمالي الموية إلى {total_water_ml} مل', null, 1.0),
  ((select id from public.recipes where slug = 'v60-hot'), 7, 'التنقيط', 'انتظر حتى تخلص الموية من الفلتر', null, null),
  ((select id from public.recipes where slug = 'v60-hot'), 8, 'قدّم', 'صب القهوة وقدّمها', null, null),

  -- V60 — باردة
  ((select id from public.recipes where slug = 'v60-iced'), 1, 'ثلج السيرفر', 'حط {server_ice_g} جرام ثلج في السيرفر', null, null),
  ((select id from public.recipes where slug = 'v60-iced'), 2, 'أضف البن', 'أضف {coffee_g} جرام بن مطحون طحنة متوسطة', null, null),
  ((select id from public.recipes where slug = 'v60-iced'), 3, 'الترطيب', 'صب {bloom_water_ml} مل موية على البن', null, null),
  ((select id from public.recipes where slug = 'v60-iced'), 4, 'انتظار الترطيب', 'انتظر 30–45 ثانية', 40, null),
  ((select id from public.recipes where slug = 'v60-iced'), 5, 'الصبة الأولى', 'صب حتى يوصل إجمالي الموية إلى {stage_water_ml} مل', null, 0.625),
  ((select id from public.recipes where slug = 'v60-iced'), 6, 'كمّل الصب', 'كمّل الصب حتى يوصل إجمالي الموية إلى {total_water_ml} مل', null, 1.0),
  ((select id from public.recipes where slug = 'v60-iced'), 7, 'حرّك السيرفر', 'حرّك السيرفر بهدوء حتى تمتزج القهوة مع الثلج، ثم صبها وقدّمها', null, null);
