import { drawerAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = defineStyle({
  overlay: {
    bg: "blackAlpha.600",
    zIndex: "overlay",
  },
  dialogContainer: {
    display: "flex",
    zIndex: "modal",
    justifyContent: "center",
    bg: "transparent",
  },
  dialog: {
    zIndex: "modal",
    maxH: "100vh",
    color: "black",
    bg: "colors.white",
    bs: "shadows.lg",
    _dark: {
      bg: "white",
      bs: "shadows.dark-lg",
      opacity: "0.9",
    },
  },
  header: {
    px: "6",
    py: "4",
    fontSize: "xl",
    fontWeight: "semibold",
    bg: "white",
  },
  closeButton: {
    position: "absolute",
    top: "2",
    insetEnd: "3",
  },
  body: {
    px: "6",
    py: "2",
    flex: "1",
    overflow: "auto",
    bg: "white",
  },
  footer: {
    px: "6",
    py: "4",
    bg: "white",
  },
});

export const drawerTheme = defineMultiStyleConfig({
  baseStyle,
});
