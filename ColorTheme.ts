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

// A soft, neutral pastel gray for default elements
export const defaultColor: ColorScale = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#ededed",
  300: "#e6e6e6",
  400: "#dfdfdf",
  500: "#d8d8d8",
  600: "#d1d1d1",
  700: "#cacaca",
  800: "#c3c3c3",
  900: "#bcbcbc",
  foreground: "#ffffff",
  DEFAULT: "#d8d8d8",
};

// Pastel blue for primary accents (think clear skies)
export const primary: ColorScale = {
  50: "#f0f8ff",
  100: "#e0f2ff",
  200: "#c0e4ff",
  300: "#a0d6ff",
  400: "#80c8ff",
  500: "#60baff",
  600: "#50aaff",
  700: "#409aff",
  800: "#308aff",
  900: "#207aff",
  foreground: "#ffffff",
  DEFAULT: "#60baff",
};

// Pastel peach for secondary accents (warm and soft)
export const secondary: ColorScale = {
  50: "#fff8f5",
  100: "#fff0eb",
  200: "#ffe1d7",
  300: "#ffd3c3",
  400: "#ffc4af",
  500: "#ffb59b",
  600: "#ff9c82",
  700: "#ff8370",
  800: "#ff695e",
  900: "#ff504c",
  foreground: "#ffffff",
  DEFAULT: "#ffb59b",
};

// Pastel green for success (fresh and natural)
export const success: ColorScale = {
  50: "#f3faf0",
  100: "#e7f5e0",
  200: "#cfeac0",
  300: "#b7dfa0",
  400: "#9fd480",
  500: "#87c860",
  600: "#6fac40",
  700: "#578530",
  800: "#3f7b20",
  900: "#275210",
  foreground: "#ffffff",
  DEFAULT: "#87c860",
};

// Pastel yellow for warning (bright but soft)
export const warning: ColorScale = {
  50: "#fffaf0",
  100: "#fff7e0",
  200: "#ffefc0",
  300: "#ffe7a0",
  400: "#ffdf80",
  500: "#ffd760",
  600: "#ffd140",
  700: "#ffc920",
  800: "#ffc200",
  900: "#ffba00",
  foreground: "#000000",
  DEFAULT: "#ffd760",
};

// A very light off-white for background surfaces
export const background: ColorScale = {
  50: "#f0fdf4",  // very light pastel green
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e", // DEFAULT pastel green
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
  foreground: "#000000", // suitable contrast for text on green
  DEFAULT: "#22c55e",
};


// A soft, muted dark gray for text (foreground)
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

// Light pastel gray for dividers
export const divider: ColorScale = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#d3d3d3",
  500: "#c6c6c6",
  600: "#b9b9b9",
  700: "#acacac",
  800: "#9f9f9f",
  900: "#929292",
  foreground: "#ffffff",
  DEFAULT: "#c6c6c6",
};

// A muted gray for overlays (such as modal backdrops)
export const overlay: ColorScale = {
  50: "#f5f5f5",
  100: "#ebebeb",
  200: "#e0e0e0",
  300: "#d6d6d6",
  400: "#cccccc",
  500: "#c2c2c2",
  600: "#b8b8b8",
  700: "#aeaeae",
  800: "#a4a4a4",
  900: "#9a9a9a",
  foreground: "#ffffff",
  DEFAULT: "#c2c2c2",
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

// Content surfaces can have subtle variations.
// Content1: a light neutral pastel surface
export const content1: ColorScale = {
  50: "#f8f8fa",
  100: "#f1f1f4",
  200: "#e9e9ed",
  300: "#e2e2e7",
  400: "#dadada",
  500: "#d3d3d3",
  600: "#cccccc",
  700: "#c5c5c5",
  800: "#bdbdbd",
  900: "#b6b6b6",
  foreground: "#000000",
  DEFAULT: "#d3d3d3",
};

// Content2: a slightly warmer, soft beige surface
export const content2: ColorScale = {
  50: "#fdfcfb",
  100: "#f9f8f6",
  200: "#f5f3f1",
  300: "#f1efec",
  400: "#edeae7",
  500: "#e9e5e2",
  600: "#e5e0dd",
  700: "#e1dbd8",
  800: "#ddddd3",
  900: "#d9d8ce",
  foreground: "#000000",
  DEFAULT: "#e9e5e2",
};

// Content3: a pastel peach-tinted surface for subtle warmth
export const content3: ColorScale = {
  50: "#fff9f8",
  100: "#fff3f0",
  200: "#ffe7e1",
  300: "#ffdbd2",
  400: "#ffcfc3",
  500: "#ffc3b4",
  600: "#ffb7a5",
  700: "#ffab96",
  800: "#ff9f87",
  900: "#ff9378",
  foreground: "#000000",
  DEFAULT: "#ffc3b4",
};

// Content4: a pastel lavender-tinted surface for a cool alternative
export const content4: ColorScale = {
  50: "#f9f8ff",
  100: "#f3f1ff",
  200: "#e7e3ff",
  300: "#dbd5ff",
  400: "#cfc7ff",
  500: "#c3b9ff",
  600: "#b7abff",
  700: "#ab9dff",
  800: "#9f8fff",
  900: "#9381ff",
  foreground: "#ffffff",
  DEFAULT: "#c3b9ff",
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
