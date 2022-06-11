import {
  Text,
  Flex,
  Spacer,
  VStack,
  useBoolean,
  HStack,
  Box,
} from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import Info from "./Info";
import * as Icon from "./Icon";

type FolderProps = {
  label: string;
  info?: string;
  children?: ReactElement | ReactElement[];
  variant?: Variant;
  startOpen?: boolean;
};

type Variant = "fat" | "normal" | "thin";

export default function Folder(props: FolderProps): JSX.Element {
  const [flag, setFlag] = useBoolean(false);

  // Should only be performer once!!!
  // That is why array is empty
  useEffect(() => {
    if (props.startOpen) {
      setFlag.on();
    }
  }, []);

  let borderTop = "1px";
  let iconSize = 4;
  let fontSize = "md";
  let fontWeight = "normal";

  if (props.variant === "fat") {
    borderTop = "2px";
    iconSize = 5;
    fontSize = "lg";
    fontWeight = "bold";
  }

  if (props.variant === "thin") {
    borderTop = "1px";
    iconSize = 4;
    fontSize = "sm";
    fontWeight = "light";
  }

  return (
    <VStack width={"100%"}>
      <Flex
        width={"100%"}
        alignItems="center"
        cursor={"pointer"}
        borderTop={borderTop}
        pt={2}
        px={2}
        onClick={setFlag.toggle}
      >
        <Text pointerEvents="none" fontSize={fontSize} fontWeight={fontWeight}>
          {props.label}
        </Text>
        <Spacer />
        <HStack alignItems="center">
          {flag ? (
            <Icon.CaretDown boxSize={iconSize} />
          ) : (
            <Icon.CaretUp boxSize={iconSize} />
          )}
          <Info boxSize={iconSize}>{props.info}</Info>
        </HStack>
      </Flex>
      <Box width={"100%"} p={2} style={{ display: flag ? "block" : "none" }}>
        {props.children}
      </Box>
    </VStack>
  );
}
