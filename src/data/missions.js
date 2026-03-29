// Mission content is data-driven so you can edit/add missions without changing core gameplay code.
export const missions = [
  {
    id: 'mission_tv_a101',
    category: 'deliver_tv_cart',
    type: 'delivery',
    title: 'Deliver TV Cart to A101',
    equipmentId: 'tv_cart',
    roomId: 'a101',
    requiredKeyId: 'wing_a',
    points: 120,
    pickupAfterMinutes: 45,
    difficulty: ['easy', 'normal', 'old_hand']
  },
  {
    id: 'mission_16mm_auditorium',
    category: 'deliver_16mm_projector',
    type: 'delivery',
    title: 'Deliver 16mm Projector to Auditorium Booth',
    equipmentId: 'projector_16mm',
    roomId: 'auditorium_booth',
    requiredKeyId: 'auditorium',
    points: 150,
    pickupAfterMinutes: 60,
    difficulty: ['normal', 'old_hand']
  },
  {
    id: 'mission_mic_library',
    category: 'deliver_microphone',
    type: 'delivery',
    title: 'Deliver Microphone Kit to Library',
    equipmentId: 'microphone',
    roomId: 'library',
    requiredKeyId: 'library',
    points: 95,
    pickupAfterMinutes: 30,
    difficulty: ['easy', 'normal', 'old_hand']
  },
  {
    id: 'mission_camcorder_gym',
    category: 'deliver_vhs_camcorder',
    type: 'delivery',
    title: 'Deliver VHS Camcorder to Gym Storage',
    equipmentId: 'vhs_camcorder',
    roomId: 'gym_storage',
    requiredKeyId: 'gym',
    points: 130,
    pickupAfterMinutes: 50,
    difficulty: ['normal', 'old_hand']
  },
  {
    id: 'mission_night_school_setup',
    category: 'night_school',
    type: 'delivery',
    title: 'Set Up for Night School Entrance Program',
    equipmentId: 'pa_cart',
    roomId: 'night_entrance',
    requiredKeyId: 'night_school',
    points: 175,
    pickupAfterMinutes: 90,
    difficulty: ['normal', 'old_hand']
  },
  {
    id: 'mission_weekend_event',
    category: 'weekend_event_support',
    type: 'delivery',
    title: 'Weekend Event Support at Auditorium',
    equipmentId: 'microphone',
    roomId: 'auditorium_main',
    requiredKeyId: 'auditorium',
    points: 160,
    pickupAfterMinutes: 120,
    difficulty: ['easy', 'normal', 'old_hand']
  },
  {
    id: 'mission_tv_b201',
    category: 'deliver_tv_cart',
    type: 'delivery',
    title: 'Deliver TV Cart to B201',
    equipmentId: 'tv_cart',
    roomId: 'b201',
    requiredKeyId: 'wing_b',
    points: 120,
    pickupAfterMinutes: 40,
    difficulty: ['easy', 'normal', 'old_hand']
  },
  {
    id: 'mission_mic_a102',
    category: 'deliver_microphone',
    type: 'delivery',
    title: 'Deliver Microphone Kit to A102',
    equipmentId: 'microphone',
    roomId: 'a102',
    requiredKeyId: 'wing_a',
    points: 100,
    pickupAfterMinutes: 25,
    difficulty: ['easy', 'normal', 'old_hand']
  },
  {
    id: 'mission_projector_media',
    category: 'deliver_16mm_projector',
    type: 'delivery',
    title: 'Deliver 16mm Projector to Media Center',
    equipmentId: 'projector_16mm',
    roomId: 'media_center',
    requiredKeyId: 'library',
    points: 140,
    pickupAfterMinutes: 70,
    difficulty: ['normal', 'old_hand']
  },
  {
    id: 'mission_basketball_shift',
    category: 'basketball_filming_shift',
    type: 'basketball_chain',
    title: 'Basketball Filming Shift',
    roomId: 'gym_main',
    requiredKeyId: 'gym',
    points: 380,
    difficulty: ['easy', 'normal', 'old_hand'],
    checkpoints: [
      { id: 'freshmen', label: 'Freshmen Game Tip-Off', at: '15:30', points: 120 },
      { id: 'jv', label: 'JV Game Tip-Off', at: '17:00', points: 120 },
      { id: 'varsity', label: 'Varsity Game Tip-Off', at: '19:00', points: 150 },
      { id: 'wrap', label: 'Strike Gear and Lock Up', at: '22:00', points: 100 }
    ]
  }
];
