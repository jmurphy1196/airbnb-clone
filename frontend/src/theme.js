export const fontSizes = {
  sm: "1em",
  md: "3em",
  lg: "4em",
  xlg: "5em",
};
const size = {
  mobile: "375px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "2200px",
};

export const device = {
  mobile: `(min-width: ${size.mobile})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  desktop: `(min-width: ${size.desktop})`,
};

export const lightTheme = {
  body: "#FFFFFF",
  text: "#222222",
  background: "#FFFFFF",
  toggleBorder: "#DDDDDD",
  primary: "#FF5A5F",
};
export const darkTheme = {
  body: "#363537",
  text: "#FAFAFA",
  toggleBorder: "#6B8096",
  background: "#999",
  primary: "#FF5A5F",
};
