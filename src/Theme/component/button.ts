import { mode } from "@chakra-ui/theme-tools";
import * as ThemeTools from "@chakra-ui/theme-tools";
import { ComponentStyleConfig } from "@chakra-ui/react";

// Example: https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/tabs.ts
const brutalistVariant: ThemeTools.SystemStyleFunction = (props) => {
  const { colorScheme: c, orientation } = props;

  const bg = mode(`${c}.300`, `${c}.500`)(props);
  const color = ThemeTools.isLight(bg)(props.theme) ? "white" : "black";

  return {
    bg: bg,
    color: color,
    _hover: {
      bg: mode(`${c}.400`, `${c}.400`)(props),
      color: color,
    },
    _focus: {
      color: color,
      border: "2px solid",
      borderColor: color,
      outline: "none",
    },
  };
};

const brutalistGhostVariant: ThemeTools.SystemStyleFunction = (props) => {
  const { colorScheme: c, orientation } = props;

  const bg = mode(`${c}.300`, `${c}.500`)(props);
  const color = mode(`black`, `white`)(props);

  return {
    color: color,
    _hover: {
      bg: bg,
      color: color,
    },
    _focus: {
      color: color,
      border: "2px solid",
      borderColor: color,
      outline: "none",
    },
  };
};

const button: ComponentStyleConfig = {
  variants: {
    brutalist: brutalistVariant,
    "brutalist-ghost": brutalistGhostVariant,
  },
};

export default button;
