export const currentYear = new Date().getFullYear();

export const getDeviceDimensions = () => {
  if (typeof window === "undefined") {
    return {
      deviceWidth: 0,
      deviceHeight: 0,
      windowWidth: 0,
      windowHeight: 0,
      pixelRatio: 1,
    };
  }

  const deviceWidth = window.screen.width;
  const deviceHeight = window.screen.height;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;

  return {
    deviceWidth,
    deviceHeight,
    windowWidth,
    windowHeight,
    pixelRatio,
  };
};

export function getFirstLetter(name: string): string {
  if (!name) return "";
  return name.charAt(0).toUpperCase();
}

export function getRandomLightColor(): string {
  const colors = [
    "#FFD700",
    "#FFA07A",
    "#90EE90",
    "#87CEFA",
    "#DDA0DD",
    "#FFB6C1",
    "#F0E68C",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
