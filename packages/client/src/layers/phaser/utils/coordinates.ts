export const getGirlCoordinates = (scale: number) => {
  switch (scale) {
    case 0.85:
      return { x: 820, y: 380, width: 250, height: 400 };
    case 0.82:
      return { x: 630, y: 270, width: 230, height: 370 };
    case 0.75:
      return { x: 600, y: 230, width: 250, height: 340 };
    default:
      return { x: 820, y: 380, width: 250, height: 400 };
  }
};

export const getVendMachineCoordinates = (scale: number) => {
  switch (scale) {
    case 0.85:
      return { x: 728, y: 590, width: 220, height: 260 };
    case 0.82:
      return { x: 540, y: 500, width: 210, height: 250 };
    case 0.75:
      return { x: 480, y: 440, width: 200, height: 220 };
    default:
      return { x: 688, y: 560, width: 220, height: 260 };
  }
}
