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
  isOpen?: boolean;
};

export default function Drawer(props: DrawerProps): JSX.Element {
  return (
    <Box h="100vh">
      <Flex>
        <Box
          display={props.isOpen ? "block" : "none"}
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
