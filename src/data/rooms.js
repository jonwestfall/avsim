// Replace placeholder names here with your actual school room list.
export const rooms = [
  {
    id: 'main_office',
    name: 'Main Office',
    area: 'Front Office',
    locked: false,
    requiredKeyId: null,
    travelMinutes: 4
  },
  {
    id: 'av_office',
    name: 'AV Office',
    area: 'Support Rooms',
    locked: true,
    requiredKeyId: 'av_office',
    travelMinutes: 2
  },
  {
    id: 'wing_a_hall',
    name: 'Wing A Hallway',
    area: 'Classroom Wing A',
    locked: false,
    requiredKeyId: null,
    travelMinutes: 5
  },
  {
    id: 'wing_b_hall',
    name: 'Wing B Hallway',
    area: 'Classroom Wing B',
    locked: false,
    requiredKeyId: null,
    travelMinutes: 5
  },
  {
    id: 'a101',
    name: 'A101 Placeholder Classroom',
    area: 'Classroom Wing A',
    locked: true,
    requiredKeyId: 'wing_a',
    travelMinutes: 7
  },
  {
    id: 'a102',
    name: 'A102 Placeholder Classroom',
    area: 'Classroom Wing A',
    locked: true,
    requiredKeyId: 'wing_a',
    travelMinutes: 7
  },
  {
    id: 'a103',
    name: 'A103 Placeholder Classroom',
    area: 'Classroom Wing A',
    locked: true,
    requiredKeyId: 'wing_a',
    travelMinutes: 8
  },
  {
    id: 'b201',
    name: 'B201 Placeholder Classroom',
    area: 'Classroom Wing B',
    locked: true,
    requiredKeyId: 'wing_b',
    travelMinutes: 8
  },
  {
    id: 'b202',
    name: 'B202 Placeholder Classroom',
    area: 'Classroom Wing B',
    locked: true,
    requiredKeyId: 'wing_b',
    travelMinutes: 8
  },
  {
    id: 'b203',
    name: 'B203 Placeholder Classroom',
    area: 'Classroom Wing B',
    locked: true,
    requiredKeyId: 'wing_b',
    travelMinutes: 8
  },
  {
    id: 'gym_main',
    name: 'Main Gym',
    area: 'Athletics',
    locked: true,
    requiredKeyId: 'gym',
    travelMinutes: 9
  },
  {
    id: 'gym_storage',
    name: 'Gym Equipment Storage',
    area: 'Athletics',
    locked: true,
    requiredKeyId: 'gym',
    travelMinutes: 10
  },
  {
    id: 'auditorium_main',
    name: 'Auditorium',
    area: 'Performance',
    locked: true,
    requiredKeyId: 'auditorium',
    travelMinutes: 9
  },
  {
    id: 'auditorium_booth',
    name: 'Auditorium Projection Booth',
    area: 'Performance',
    locked: true,
    requiredKeyId: 'auditorium',
    travelMinutes: 10
  },
  {
    id: 'library',
    name: 'Library',
    area: 'Academic Support',
    locked: true,
    requiredKeyId: 'library',
    travelMinutes: 7
  },
  {
    id: 'media_center',
    name: 'Media Center',
    area: 'Academic Support',
    locked: true,
    requiredKeyId: 'library',
    travelMinutes: 7
  },
  {
    id: 'night_entrance',
    name: 'Night School Entrance',
    area: 'Evening Programs',
    locked: true,
    requiredKeyId: 'night_school',
    travelMinutes: 6
  },
  {
    id: 'night_room_1',
    name: 'Night School Room 1',
    area: 'Evening Programs',
    locked: true,
    requiredKeyId: 'night_school',
    travelMinutes: 8
  }
];
