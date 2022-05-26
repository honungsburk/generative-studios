import { UserInteraction, icon } from "../Projects/UserInteractions";
import { IconProps, Tooltip, Box } from "@chakra-ui/react";

/**
 *
 * @param props the kind of user interaction
 * @returns an icon of that user interaction with a tooltip
 */
export default function UserInteractionIcon(
  props: { kind: UserInteraction } & IconProps
) {
  const { kind, ...iconprops } = props;
  return (
    <Tooltip label={props.kind} fontSize="md">
      <Box>{icon(kind)(iconprops)}</Box>
    </Tooltip>
  );
}
