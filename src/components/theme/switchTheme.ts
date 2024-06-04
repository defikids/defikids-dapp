import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {},
  thumb: {
    bg: "blue.500",
  },
  track: {
    bg: "gray.100",
    _checked: {
      bg: "gray.100",
    },
  },
});

export const switchTheme = defineMultiStyleConfig({ baseStyle });
