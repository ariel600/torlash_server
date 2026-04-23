/**
 * מניעת ביטויי אופרטורים של MongoDB ($) בתוך אובייקטי בקשה/שאילתה
 * (הקשה על NoSQL-injection ב־body ובפרמטר ‎`q`‎).
 */
export function stripMongoOperators<T extends Record<string, unknown>>(value: T): T {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }
  const out = {} as Record<string, unknown>;
  for (const k of Object.keys(value)) {
    if (k.startsWith('$') || k.includes('.')) {
      continue;
    }
    const v = (value as Record<string, unknown>)[k];
    if (v != null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
      out[k] = stripMongoOperators(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

/** שדה מיון: רק אותיות, מספרים, נקודה, קו תחתון (שמות שדות לגיטימיים) */
const SORT_KEY = /^[a-zA-Z0-9_.-]{1,64}$/;

export function buildSafeSort(sortStr: string | undefined | null): Record<string, 1 | -1> {
  if (sortStr == null || sortStr === '') {
    return { created_date: -1 };
  }
  const desc = sortStr.startsWith('-');
  const key = desc ? sortStr.slice(1) : sortStr;
  if (!SORT_KEY.test(key)) {
    return { created_date: -1 };
  }
  return { [key]: (desc ? -1 : 1) as 1 | -1 };
}
