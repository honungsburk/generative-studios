import {
  Button,
  HStack,
  useDisclosure,
  SlideFade,
  Box,
} from "@chakra-ui/react";
import React from "react";

export default function AlgoMarble() {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <HStack>
      <SlideFade in={isOpen} offsetX="-20px">
        {isOpen ? (
          <Box
            p="40px"
            color="white"
            mt="4"
            bg="teal.500"
            rounded="md"
            shadow="md"
          ></Box>
        ) : (
          <></>
        )}
      </SlideFade>
      <Button colorScheme="teal" onClick={onToggle}>
        Open
      </Button>
    </HStack>
  );
}
