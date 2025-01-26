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
