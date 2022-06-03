import type {
  PartsStyleFunction,
  SystemStyleFunction,
} from "@chakra-ui/theme-tools";
import { mode } from "@chakra-ui/theme-tools";
import { ComponentStyleConfig } from "@chakra-ui/react";

// Example: https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/tabs.ts
const brutalistVariant: PartsStyleFunction<any> = (props) => {
  const { colorScheme: c } = props;
  const bg = mode(`${c}.900`, `${c}.100`)(props);
  const color = mode(`white`, `black`)(props);

  return {
    track: {
      bgColor: `${c}.300`,
    },
    thumb: {
      color: color,
    },
    filledTrack: {
      bgColor: bg,
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
