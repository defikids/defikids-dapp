import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  overlay: {
    bg: "blackAlpha.200", //change the background
  },
  dialog: {
    borderRadius: "md",
    bg: `white`,
    color: "black",
  },
  body: {
    bg: "white",
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});
