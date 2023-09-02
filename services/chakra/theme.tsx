import { extendTheme } from "@chakra-ui/react";
import { modalTheme } from "@/components/theme/modalTheme";
import { switchTheme } from "@/components/theme/switchTheme";
import { menuTheme } from "@/components/theme/menuTheme";
import { drawerTheme } from "@/components/theme/drawerTheme";

export const colors = {
  brand: {
    purple: "#4F1B7C",
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const fonts = {
  heading: `'Slackey', sans-serif`,
  body: `'JetBrains Mono', monospace`,
};

const breakpoints = {
  sm: "48em",
  md: "62em",
  lg: "80em",
  xl: "96em",
  "2xl": "120em",
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const components = {
  Modal: modalTheme,
  Switch: switchTheme,
  Menu: menuTheme,
  Drawer: drawerTheme,
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  breakpoints,
});
