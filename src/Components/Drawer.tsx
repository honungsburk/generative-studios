import { Box, Flex, BoxProps } from "@chakra-ui/react";
import React from "react";

export type DrawerProps = {
  drawer?: React.ReactNode;
  children?: React.ReactNode;
  isOpen?: boolean;
} & BoxProps;

const Drawer = React.forwardRef(
  (
    { drawer, children, isOpen, ...rest }: DrawerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <Box h="100vh" ref={ref} {...rest}>
        <Flex>
          <Box
            display={isOpen ? "block" : "none"}
            bgColor="background.light"
            maxHeight={"100vh"}
          >
            {drawer}
          </Box>
          <Box height={"100vh"} flex="1" overflowY={"hidden"}>
            {children}
          </Box>
        </Flex>
      </Box>
    );
  }
);

Drawer.displayName = "Drawer";

export default Drawer;
