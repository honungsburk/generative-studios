import type {
  PartsStyleFunction,
  SystemStyleFunction,
} from "@chakra-ui/theme-tools";

import { mode } from "@chakra-ui/theme-tools";
import { ComponentStyleConfig } from "@chakra-ui/react";

// Example: https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/tabs.ts
const brutalistVariant: PartsStyleFunction<any> = (props) => {
  const { colorScheme: c, orientation } = props;
  const isVertical = orientation === "vertical";
  const borderProp = isVertical ? "borderStart" : "borderBottom";
  const marginProp = isVertical ? "marginStart" : "marginBottom";

  const bg = mode(`${c}.900`, `${c}.100`)(props);
  const color = mode(`white`, `black`)(props);

  return {
    tablist: {
      [borderProp]: "4px solid",
      borderColor: bg,
    },
    tab: {
      [borderProp]: "2px solid",
      borderColor: "transparent",
      [marginProp]: "-2px",
      _selected: {
        color: color,
        bg: bg,
        borderColor: bg,
      },
      _active: {
        bg: mode("gray.200", "whiteAlpha.300")(props),
      },
      _disabled: {
        _active: { bg: "none" },
      },
    },
  };
};

const tabs: ComponentStyleConfig = {
  parts: ["tablist", "tab"],
  variants: {
    brutalist: brutalistVariant,
  },
};

export default tabs;
