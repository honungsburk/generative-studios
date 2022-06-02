import type {
  PartsStyleFunction,
  SystemStyleFunction,
} from "@chakra-ui/theme-tools";

import { tabsAnatomy as parts } from "@chakra-ui/anatomy";
import { mode } from "@chakra-ui/theme-tools";
import * as ThemeTools from "@chakra-ui/theme-tools";
import { ComponentStyleConfig } from "@chakra-ui/react";

// Example: https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/tabs.ts
const brutalistVariant: PartsStyleFunction<any> = (props) => {
  const { colorScheme: c, orientation } = props;

  const bg = mode(`${c}.300`, `${c}.500`)(props);
  const color = ThemeTools.isLight(bg)(props.theme) ? "white" : "black";

  return {
    field: {
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
      },
    },
  };
};

const input: ComponentStyleConfig = {
  parts: ["field"],
  variants: {
    brutalist: brutalistVariant,
  },
};

export default input;
