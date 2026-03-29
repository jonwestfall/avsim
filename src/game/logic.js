import { missions } from '../data/missions';

export const START_OF_SHIFT_MINUTE = 7 * 60 + 30;

export function seededRng(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    h ^= seedText.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return function random() {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function toClock(minuteOfDay) {
  const h24 = Math.floor(minuteOfDay / 60) % 24;
  const m = minuteOfDay % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function parseClock(input) {
  const [hText, mText] = input.split(':');
  return Number(hText) * 60 + Number(mText);
}

export function missionCountByDifficulty(difficulty) {
  if (difficulty === 'easy') return 5;
  if (difficulty === 'old_hand') return 9;
  return 7;
}

export function wrongKeyPenaltyMinutes(difficulty) {
  if (difficulty === 'easy') return 4;
  if (difficulty === 'old_hand') return 10;
  return 7;
}

export function scorePenaltyWrongKey(difficulty) {
  if (difficulty === 'easy') return 10;
  if (difficulty === 'old_hand') return 30;
  return 20;
}

export function speedBonus(points, elapsedMinutes) {
  const ideal = 20;
  const over = Math.max(0, elapsedMinutes - ideal);
  const bonus = Math.max(0, 45 - over);
  return Math.min(points, bonus);
}

export function comboBonus(combo) {
  if (combo < 2) return 0;
  return combo * 8;
}

export function shiftOfTheDay(dateText, difficulty) {
  const seed = `${dateText}:${difficulty}`;
  const random = seededRng(seed);

  const pool = missions.filter((m) => m.difficulty.includes(difficulty));
  const basketball = pool.find((m) => m.type === 'basketball_chain');
  const nonBasketball = pool.filter((m) => m.type !== 'basketball_chain');

  for (let i = nonBasketball.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [nonBasketball[i], nonBasketball[j]] = [nonBasketball[j], nonBasketball[i]];
  }

  const pickCount = Math.min(missionCountByDifficulty(difficulty) - 1, nonBasketball.length);
  const selected = nonBasketball.slice(0, pickCount);

  if (basketball) {
    selected.push(basketball);
  }

  return selected;
}
