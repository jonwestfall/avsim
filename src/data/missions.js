// Mission content is data-driven so you can edit/add missions without changing core gameplay code.
export const missions = [
  {
    "id": "mission_tv_a101",
    "category": "deliver_tv_cart",
    "type": "delivery",
    "title": "Deliver TV Cart to A Social Studies Teacher",
    "equipmentId": "tv_cart",
    "roomId": "218",
    "requiredKeyId": "2as1",
    "points": 120,
    "pickupAfterMinutes": 45,
    "difficulty": [
      "easy",
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_16mm_auditorium",
    "category": "deliver_16mm_projector",
    "type": "delivery",
    "title": "Deliver 16mm Projector to an English Teacher",
    "equipmentId": "projector_16mm",
    "roomId": "114",
    "requiredKeyId": "corbin",
    "points": 150,
    "pickupAfterMinutes": 60,
    "difficulty": [
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_mic_library",
    "category": "deliver_microphone",
    "type": "delivery",
    "title": "Deliver Microphone Kit to Cafeteria",
    "equipmentId": "microphone",
    "roomId": "cafm",
    "requiredKeyId": "2aba1",
    "points": 95,
    "pickupAfterMinutes": 30,
    "difficulty": [
      "easy",
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_camcorder_gym",
    "category": "deliver_vhs_camcorder",
    "type": "delivery",
    "title": "Deliver VHS Camcorder to Gym",
    "equipmentId": "vhs_camcorder",
    "roomId": "gym",
    "requiredKeyId": "2aba1",
    "points": 130,
    "pickupAfterMinutes": 50,
    "difficulty": [
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_night_school_setup",
    "category": "night_school",
    "type": "delivery",
    "title": "Set Up for Night English",
    "equipmentId": "pa_cart",
    "roomId": "114",
    "requiredKeyId": "corbin",
    "points": 175,
    "pickupAfterMinutes": 90,
    "difficulty": [
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_weekend_event",
    "category": "weekend_event_support",
    "type": "delivery",
    "title": "Weekend Event Support at Auditorium",
    "equipmentId": "microphone",
    "roomId": "auditorium_main",
    "requiredKeyId": "2ah",
    "points": 160,
    "pickupAfterMinutes": 120,
    "difficulty": [
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_tv_b201",
    "category": "deliver_tv_cart",
    "type": "delivery",
    "title": "Deliver TV Cart to B243",
    "equipmentId": "tv_cart",
    "roomId": "b243",
    "requiredKeyId": "key_10",
    "points": 120,
    "pickupAfterMinutes": 40,
    "difficulty": [
      "easy",
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_mic_a102",
    "category": "deliver_microphone",
    "type": "delivery",
    "title": "Deliver Microphone to Gym",
    "equipmentId": "microphone",
    "roomId": "gym",
    "requiredKeyId": "2aba1",
    "points": 100,
    "pickupAfterMinutes": 25,
    "difficulty": [
      "easy",
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_projector_media",
    "category": "deliver_16mm_projector",
    "type": "delivery",
    "title": "Deliver 16mm Projector to Library",
    "equipmentId": "projector_16mm",
    "roomId": "library",
    "requiredKeyId": "2ag",
    "points": 140,
    "pickupAfterMinutes": 70,
    "difficulty": [
      "normal",
      "old_hand"
    ]
  },
  {
    "id": "mission_basketball_shift",
    "category": "basketball_filming_shift",
    "type": "basketball_chain",
    "title": "Basketball Filming Shift",
    "roomId": "gym",
    "requiredKeyId": "2aba1",
    "points": 380,
    "difficulty": [
      "easy",
      "normal",
      "old_hand"
    ],
    "checkpoints": [
      {
        "id": "freshmen",
        "label": "Freshmen Game Tip-Off",
        "at": "15:30",
        "points": 120
      },
      {
        "id": "jv",
        "label": "JV Game Tip-Off",
        "at": "17:00",
        "points": 120
      },
      {
        "id": "varsity",
        "label": "Varsity Game Tip-Off",
        "at": "19:00",
        "points": 150
      },
      {
        "id": "wrap",
        "label": "Strike Gear and Lock Up",
        "at": "22:00",
        "points": 100
      }
    ]
  }
];
