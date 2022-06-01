import {
  Text,
  Flex,
  Spacer,
  VStack,
  useBoolean,
  HStack,
  Box,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import Info from "./Info";
import * as Icon from "./Icon";

type FolderProps = {
  label: string;
  info?: string;
  children?: ReactElement | ReactElement[];
  variant?: Variant;
};

type Variant = "fat" | "normal" | "thin";

export default function Folder(props: FolderProps): JSX.Element {
  const [flag, setFlag] = useBoolean();
  const variant: Variant = props.variant ? props.variant : "normal";

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

  const isOpen = !flag;

  return (
    <VStack width={"100%"}>
      <Flex
        width={"100%"}
        alignItems="center"
        cursor={"pointer"}
        borderTop={borderTop}
        pt={2}
        onClick={setFlag.toggle}
      >
        <Text pointerEvents="none" fontSize={fontSize} fontWeight={fontWeight}>
          {props.label}
        </Text>
        <Spacer />
        <HStack alignItems="center">
          {isOpen ? (
            <Icon.CaretDown boxSize={iconSize} />
          ) : (
            <Icon.CaretUp boxSize={iconSize} />
          )}
          <Info boxSize={iconSize}>{props.info}</Info>
        </HStack>
      </Flex>
      <Box width={"100%"} px={2} style={{ display: isOpen ? "block" : "none" }}>
        {props.children}
      </Box>
    </VStack>
  );
}
