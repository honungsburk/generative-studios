import { mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
import { extendTheme } from "@chakra-ui/react";
import colors from "./Colors";
import tabs from "./component/tabs";
import input from "./component/input";
import button from "./component/button";
import slider from "./component/slider";

const global = (props: Dict<any>) => ({
  body: {
    color: mode("black", "white")(props),
    bg: mode("background.light", "background.dark")(props),
  },

  /* Scrollbar */
  "::-webkit-scrollbar": {
    width: "8px",
  },

  "::-webkit-scrollbar-track": {
    background: mode("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.1)")(props),
    borderRadius: "40px",
  },

  "::-webkit-scrollbar-thumb": {
    borderRadius: "40px",
    background: mode("rgba(0, 0, 0, 0.4)", "rgba(255, 255, 255, 0.4)")(props),
  },

  "::-webkit-scrollbar-thumb:hover": {
    background: mode("rgba(0, 0, 0, 0.7)", "rgba(255, 255, 255, 0.7)")(props),
  },
});

export const Theme = extendTheme({
  styles: {
    global: global,
  },
  components: {
    Tabs: tabs,
    Input: input,
    Button: button,
  },
  shadows: {
    outline: "2px solid black",
  },
  colors: colors,
  initialColorMode: "light",
  useSystemColorMode: false,
});

export default Theme;
