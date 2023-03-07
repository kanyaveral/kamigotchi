interface RoomInfo {
  room: number;
  available: boolean;
}
type GridRooms = { [key: string]: RoomInfo };

export const roomExits = [
  { up: 0, down: 0 },
  { up: 2, down: 0 },
  { up: 3, down: 1 },
  { up: 4, down: 2 },
  { up: 0, down: 3 },
];

export const gridRooms: GridRooms = {
  '3': { room: 10, available: false },
  '13': { room: 9, available: false },
  '14': { room: 8, available: false },
  '15': { room: 7, available: false },
  '26': { room: 6, available: false },
  '27': { room: 5, available: false },
  '37': { room: 4, available: true },
  '38': { room: 3, available: true },
  '39': { room: 2, available: true },
  '40': { room: 1, available: true },
};

export const describeCharacther = {
  bodyType: [
    'Bee',
    'Butterfly',
    'Cube',
    'Default',
    'Drip',
    'Bulb',
    'Octahedron',
    'Eldritch',
    'Orb',
    'Tube',
    'Ghost',
    'Orb',
  ],
  colors: ['Canto Green'],
  handType: [
    'Orbs',
    'Eyeballs',
    'Mantis',
    'Paws',
    'Plugs',
    'Scorpion',
    'Tentacles',
    'Claws',
  ],
  face: ['^-^', 'c_c', ':3', '._.', 'ಠ_ಠ', 'Dotted', 'Squiggle', 'v_v', 'x_x'],
};
