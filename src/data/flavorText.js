export const flavorText = {
  wrongKey: [
    'Nope. That key has never met this lock in its life.',
    'The lock laughs politely and remains locked.',
    'Wrong key. Somewhere, a janitor shakes their head knowingly.'
  ],
  successUnlock: [
    'Click. You are now one with the building.',
    'Unlocked. Another tiny victory for public education.',
    'The door opens with the confidence of a union coffee break.'
  ],
  missionComplete: [
    'That TV weighs as much as a troubled marriage.',
    'The projector smells like hot dust and educational film strips.',
    'Delivery complete. Your clipboard aura grows stronger.'
  ],
  pickupComplete: [
    'Pickup done. Nothing says closure like coiling 40 feet of cable.',
    'Recovered and returned. The AV Office shelves feel whole again.',
    'You reclaimed the equipment and at least three mystery adapters.'
  ],
  shiftSummary: [
    'You smelled faintly of dust, warm CRT plastic, and responsibility.',
    'Another shift complete. The halls are quiet, but your key ring still hums.',
    'You served this school with elbow grease and accurate cable labeling.'
  ],
  idleMessages: [
    'The copy machine nearby is making sounds no one should trust.',
    'A teacher asks if HDMI can fit into RCA if you try hard enough.',
    'Somewhere in Wing B, a VCR clock still blinks 12:00.'
  ]
};

export function pickRandom(list, random = Math.random) {
  if (!list || list.length === 0) return '';
  return list[Math.floor(random() * list.length)];
}
