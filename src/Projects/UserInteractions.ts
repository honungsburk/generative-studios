import { IconProps } from "@chakra-ui/react";
import * as Icon from "../Components/Icon";

export type UserInteraction = "Mouse" | "Audio" | "Location" | "Mic";

/**
 * Get the icon that corresponds to your form of user interaction
 *
 * @param userInteraction the type of user intercation
 * @returns a function to create a icon for that interaction
 */
export function icon(
  userInteraction: UserInteraction
): (props: IconProps) => JSX.Element {
  switch (userInteraction) {
    case "Audio":
      return Icon.Headphones;
    case "Mouse":
      return Icon.Mouse;
    case "Location":
      return Icon.Location;
    case "Mic":
      return Icon.Mic;
  }
}
