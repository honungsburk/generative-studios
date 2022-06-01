import {
  Text,
  Flex,
  Spacer,
  VStack,
  useBoolean,
  HStack,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import Info from "./Info";
import * as Icon from "./Icon";

type FolderProps = {
  label: string;
  info?: string;
  children?: ReactElement;
  variant?: Variant;
};

type Variant = "fat" | "normal";

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

  const isOpen = !flag;

  return (
    <VStack width={"100%"} onClick={setFlag.toggle}>
      <Flex
        width={"100%"}
        alignItems="center"
        cursor={"pointer"}
        borderTop={borderTop}
        pt={2}
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
      {isOpen ? props.children : <></>}
    </VStack>
  );
}
