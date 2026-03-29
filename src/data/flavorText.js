export const flavorText = {
  "wrongKey": [
    "Nope. Not even the Rocket could open that with this key, baby.",
    "Nope, the key doesn't listen. Just like an AV kid wearing giant headphones doesn't listen to gym or English teachers.",
    "Wrong key. Somewhere, a Triv shakes his head knowingly."
  ],
  "successUnlock": [
    "Click. AV guys get wherever they need to go.",
    "Unlocked. Another tiny victory for public education.",
    "The door opens with the confidence of pink whoopness."
  ],
  "missionComplete": [
    "That TV weighs as much as a troubled marriage.",
    "The projector smells like hot dust and educational film strips.",
    "Delivery complete. Your clipboard aura grows stronger.",
    "The Workorder said to do this... and only this... got it?"
  ],
  "pickupComplete": [
    "Pickup done. Nothing says closure like coiling 40 feet of cable.",
    "Recovered and returned. The AV Office shelves feel whole again.",
    "You reclaimed the equipment and at least three mystery adapters."
  ],
  "shiftSummary": [
    "You smelled faintly of dust, warm CRT plastic, and responsibility.",
    "Another shift complete. The halls are quiet, but your key ring still hums.",
    "You served this school with elbow grease and accurate cable labeling."
  ],
  "idleMessages": [
    "The copy machine nearby is making sounds no one should trust.",
    "A coach asks if you can record sound on the basketball games. You lie.",
    "Three angles is all you need for a basketball court."
  ]
};

export function pickRandom(list, random = Math.random) {
  if (!list || list.length === 0) return '';
  return list[Math.floor(random() * list.length)];
}
