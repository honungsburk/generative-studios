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
import React from "react";
export type DrawerProps = {
  drawer?: React.ReactElement | React.ReactElement[];
  children?: React.ReactElement | React.ReactElement[];
  onOpen?: () => void;
  onClose?: () => void;
};

export default function Drawer(props: DrawerProps): JSX.Element {
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [hidden, setHidden] = useState(isOpen);

  React.useEffect(() => {
    if (hidden) {
      props.onClose && props.onClose();
    } else {
      props.onOpen && props.onOpen();
    }
  }, [hidden]);

  return (
    <Box h="100vh">
      <IconButton
        {...getButtonProps()}
        position={"absolute"}
        top={4}
        left={isOpen ? 80 : 4}
        aria-label="Expand"
        icon={isOpen ? <Icon.CaretLeft /> : <Icon.CaretRight />}
        zIndex={100}
      />
      <Flex>
        <Box
          display={isOpen ? "block" : "none"}
          bgColor="background.light"
          maxHeight={"100vh"}
        >
          {props.drawer}
        </Box>
        <Box height={"100vh"} flex="1" overflowY={"hidden"}>
          {props.children}
        </Box>
      </Flex>
    </Box>
  );
}
