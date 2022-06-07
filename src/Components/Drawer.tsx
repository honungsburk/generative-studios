import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  keyframes,
  Stack,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import * as Icon from "./Icon";
import { motion } from "framer-motion";
import { useState } from "react";
import Theme from "src/Theme";
export type DrawerProps = {
  drawer?: React.ReactElement | React.ReactElement[];
  children?: React.ReactElement | React.ReactElement[];
};

export default function Drawer(props: DrawerProps): JSX.Element {
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [hidden, setHidden] = useState(!isOpen);

  // const buttonCss: any = {
  //   overflowX: "hidden",
  //   animation: isOpen
  //     ? `${forwardAnimation} 0.2s linear forwards`
  //     : `${reverseAnimation} 0.2s linear forwards`,
  // };
  console.log(getDisclosureProps());
  return (
    <Box h="100vh">
      <IconButton
        {...getButtonProps()}
        position={"absolute"}
        top={4}
        right={4}
        aria-label="Expand"
        icon={isOpen ? <Icon.CaretLeft /> : <Icon.CaretRight />}
        // css={buttonCss}
      />
      <Box>
        <motion.div
          {...getDisclosureProps()}
          hidden={hidden}
          initial={false}
          onAnimationStart={() => setHidden(false)}
          onAnimationComplete={() => setHidden(!isOpen)}
          animate={{ width: isOpen ? 400 : 0 }}
          style={{
            backgroundColor: Theme["colors"]["background"]["light"],
            overflow: "hidden",
            whiteSpace: "nowrap",
            position: "absolute",
            left: "0",
            height: "100vh",
            top: "0",
          }}
        >
          {props.drawer}
        </motion.div>
        <motion.div
          initial={false}
          animate={{ width: isOpen ? "100%" : "50%" }}
          style={{
            position: "absolute",
            right: "0",
            height: "100vh",
            top: "0",
          }}
        >
          {props.children}
        </motion.div>
      </Box>
    </Box>
  );
}
