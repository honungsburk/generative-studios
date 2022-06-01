import { Tooltip, Center } from "@chakra-ui/react";
import * as Icon from "./Icon";

/**
 * Used to let users get info about some option by hovering or clicking/pressing
 */
export default function Info(props: {
  "aria-label"?: string;
  children: React.ReactNode;
  boxSize?: number;
}): JSX.Element {
  return (
    <Tooltip label={props.children} aria-label={props["aria-label"]}>
      <Center>
        <Icon.Info boxSize={props.boxSize} />
      </Center>
    </Tooltip>
  );
}
