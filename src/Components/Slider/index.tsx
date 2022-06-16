import { HStack, Text } from "@chakra-ui/react";
import Info from "../Info";
import SliderThumbWithTooltip, {
  SliderThumbWithTooltipProps,
} from "./WithValueToolTip";

export default function Slider<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(
  props: {
    label: string;
    info: string;
  } & SliderThumbWithTooltipProps<STEP, MIN, MAX>
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
