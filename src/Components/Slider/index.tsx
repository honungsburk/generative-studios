import { HStack, Text } from "@chakra-ui/react";
import Info from "../Info";
import SliderThumbWithTooltip, {
  SliderThumbWithTooltipProps,
} from "./WithValueToolTip";

export default function Slider(
  props: {
    label: string;
    info: string;
  } & SliderThumbWithTooltipProps
) {
  const { label, info, ...rest } = props;

  return (
    <HStack>
      <Text fontSize="sm" whiteSpace={"nowrap"}>
        {label}
      </Text>
      <SliderThumbWithTooltip {...rest} />
      <Info>{info}</Info>
    </HStack>
  );
}
