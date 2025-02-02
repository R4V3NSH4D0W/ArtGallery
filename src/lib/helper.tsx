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

export function getColorByFirstLetter(letter: string): string {
  const colors: { [key: string]: string } = {
    A: "#FFD700", // Gold
    B: "#FFA07A", // Light Salmon
    C: "#90EE90", // Light Green
    D: "#87CEFA", // Light Sky Blue
    E: "#DDA0DD", // Plum
    F: "#FFB6C1", // Light Pink
    G: "#F0E68C", // Khaki
    H: "#FF6347", // Tomato
    I: "#40E0D0", // Turquoise
    J: "#FF4500", // Orange Red
    K: "#32CD32", // Lime Green
    L: "#1E90FF", // Dodger Blue
    M: "#FF69B4", // Hot Pink
    N: "#8A2BE2", // Blue Violet
    O: "#00CED1", // Dark Turquoise
    P: "#DC143C", // Crimson
    Q: "#228B22", // Forest Green
    R: "#9932CC", // Dark Orchid
    S: "#FF8C00", // Dark Orange
    T: "#4682B4", // Steel Blue
    U: "#C71585", // Medium Violet Red
    V: "#20B2AA", // Light Sea Green
    W: "#B22222", // Firebrick
    X: "#FF00FF", // Magenta
    Y: "#008B8B", // Dark Cyan
    Z: "#6A5ACD", // Slate Blue
  };

  // Convert to uppercase to make sure it's case-insensitive
  const upperLetter = letter.toUpperCase();

  // Return the color if the letter exists, otherwise return a default color
  return colors[upperLetter] || "#CCCCCC"; // Default gray if letter is unknown
}
