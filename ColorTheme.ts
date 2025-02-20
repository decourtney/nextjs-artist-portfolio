export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  foreground: string;
  DEFAULT: string;
};

// A cool neutral pastel gray with a slight blue undertone
export const defaultColor: ColorScale = {
  50: "#f5f7fa",
  100: "#ebeff5",
  200: "#d6dceb",
  300: "#c1c8e1",
  400: "#adb4d7",
  500: "#979fcf",
  600: "#818bc7",
  700: "#6c77bf",
  800: "#5763b7",
  900: "#4350af",
  foreground: "#ffffff",
  DEFAULT: "#979fcf",
};

// A deeper, cool pastel blue for primary accents
export const primary: ColorScale = {
  50: "#e8f0ff",
  100: "#d0e1ff",
  200: "#b8d1ff",
  300: "#a0c2ff",
  400: "#88b2ff",
  500: "#70a3ff",
  600: "#6092e6",
  700: "#507fcc",
  800: "#406db3",
  900: "#305a99",
  foreground: "#ffffff",
  DEFAULT: "#70a3ff",
};

// A soft pastel pink for secondary accents
export const secondary: ColorScale = {
  50: "#fff5f7",
  100: "#ffe7ea",
  200: "#ffcfd5",
  300: "#ffb7c0",
  400: "#ff9fae",
  500: "#ff879b",
  600: "#ff6f88",
  700: "#ff5775",
  800: "#ff3f62",
  900: "#ff274f",
  foreground: "#ffffff",
  DEFAULT: "#ff879b",
};

// A pastel teal for success states
export const success: ColorScale = {
  50: "#e0f8f2",
  100: "#c2f0e6",
  200: "#a3e8da",
  300: "#85e0ce",
  400: "#66d8c2",
  500: "#48d0b6",
  600: "#3ab3a1",
  700: "#2d9783",
  800: "#207b69",
  900: "#145f50",
  foreground: "#ffffff",
  DEFAULT: "#48d0b6",
};

// A soft pastel yellow for warning messages
export const warning: ColorScale = {
  50: "#fffef5",
  100: "#fffde6",
  200: "#fffbcf",
  300: "#fff8b8",
  400: "#fff6a1",
  500: "#fff489",
  600: "#fff16f",
  700: "#ffee55",
  800: "#ffeb3b",
  900: "#ffe821",
  foreground: "#000000",
  DEFAULT: "#fff489",
};

// A soft pastel blue for background surfaces
export const background: ColorScale = {
  50: "#ffffff",
  100: "#eff8ff",
  200: "#d9f0ff",
  300: "#c3e7ff",
  400: "#addfff",
  500: "#97d7ff",
  600: "#82cfff",
  700: "#6dc7ff",
  800: "#57bfff",
  900: "#42b7ff",
  foreground: "#000000",
  DEFAULT: "#ffffff",
};

// A soft, muted dark gray for text
export const foreground: ColorScale = {
  50: "#f3f3f3",
  100: "#e6e6e6",
  200: "#d9d9d9",
  300: "#cccccc",
  400: "#bfbfbf",
  500: "#b3b3b3",
  600: "#a6a6a6",
  700: "#999999",
  800: "#8c8c8c",
  900: "#808080",
  foreground: "#ffffff",
  DEFAULT: "#b3b3b3",
};

// A cool, pastel gray for dividers
export const divider: ColorScale = {
  50: "#f7f7fa",
  100: "#f0f0f5",
  200: "#e8e8f0",
  300: "#e1e1eb",
  400: "#d9d9e6",
  500: "#d2d2e1",
  600: "#cbcbdc",
  700: "#c4c4d7",
  800: "#bdbdd2",
  900: "#b6b6cd",
  foreground: "#ffffff",
  DEFAULT: "#d2d2e1",
};

// A muted cool gray for overlays (e.g. modal backdrops)
export const overlay: ColorScale = {
  50: "#f2f2f5",
  100: "#e6e6eb",
  200: "#d9d9e1",
  300: "#ccccd7",
  400: "#bfbfcf",
  500: "#b3b3c7",
  600: "#a6a6bf",
  700: "#9999b7",
  800: "#8c8cab",
  900: "#8080a3",
  foreground: "#ffffff",
  DEFAULT: "#b3b3c7",
};

// A soft pastel violet-blue for focus states
export const focus: ColorScale = {
  50: "#f7f3ff",
  100: "#eee7ff",
  200: "#ddd0ff",
  300: "#ccb9ff",
  400: "#baa2ff",
  500: "#a38bff",
  600: "#8c74ff",
  700: "#755dff",
  800: "#5e46ff",
  900: "#4730ff",
  foreground: "#ffffff",
  DEFAULT: "#a38bff",
};

// Content1: a light, cool neutral pastel surface
export const content1: ColorScale = {
  50: "#f8f9fb",
  100: "#f1f3f7",
  200: "#e9ecf3",
  300: "#e2e6ef",
  400: "#dadfeb",
  500: "#d3d9e7",
  600: "#ccd3e3",
  700: "#c5cde0",
  800: "#bdb7dc",
  900: "#b6b1d8",
  foreground: "#000000",
  DEFAULT: "#d3d9e7",
};

// Content2: a light cool beige (nearly white) with a hint of blue
export const content2: ColorScale = {
  50: "#fefefc",
  100: "#fdfdf9",
  200: "#fbfbf5",
  300: "#f9f9f1",
  400: "#f7f7ed",
  500: "#f5f5e9",
  600: "#f3f3e5",
  700: "#f1f1e1",
  800: "#efefe0",
  900: "#ededdc",
  foreground: "#000000",
  DEFAULT: "#f5f5e9",
};

// Content3: a pale sky blue surface for subtle variation
export const content3: ColorScale = {
  50: "#f7faff",
  100: "#eef5ff",
  200: "#ddebff",
  300: "#cce1ff",
  400: "#bbd7ff",
  500: "#aadcff",
  600: "#99d2ff",
  700: "#88c8ff",
  800: "#77beff",
  900: "#66b4ff",
  foreground: "#000000",
  DEFAULT: "#aadcff",
};

// Content4: a pastel gray-blue surface for an alternative feel
export const content4: ColorScale = {
  50: "#f9fafb",
  100: "#f3f5f7",
  200: "#e7ebef",
  300: "#dbe1e7",
  400: "#cfd7df",
  500: "#c3cdd7",
  600: "#b7c3cf",
  700: "#abb9c7",
  800: "#9fafbf",
  900: "#93a5b7",
  foreground: "#ffffff",
  DEFAULT: "#c3cdd7",
};

export const customColors = {
  default: defaultColor,
  primary,
  secondary,
  success,
  warning,
  background,
  foreground,
  divider,
  overlay,
  focus,
  content1,
  content2,
  content3,
  content4,
};
