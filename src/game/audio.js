let audioContext;

function getContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
  return audioContext;
}

function tone(freq, duration = 0.12, type = 'sine', volume = 0.08) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  osc.start(now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.stop(now + duration);
}

export function playSound(kind, enabled) {
  if (!enabled) return;

  if (kind === 'key_jingle') {
    tone(660, 0.06, 'triangle', 0.05);
    setTimeout(() => tone(880, 0.08, 'triangle', 0.05), 70);
    return;
  }

  if (kind === 'cart_roll') {
    tone(140, 0.14, 'sawtooth', 0.03);
    setTimeout(() => tone(120, 0.1, 'sawtooth', 0.03), 110);
    return;
  }

  if (kind === 'unlock_ok') {
    tone(540, 0.08, 'square', 0.05);
    setTimeout(() => tone(720, 0.1, 'square', 0.05), 100);
    return;
  }

  if (kind === 'unlock_fail') {
    tone(180, 0.16, 'sawtooth', 0.06);
  }
}
