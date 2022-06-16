import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import * as MathExtra from "src/Libraries/MathExtra";
import { ConstrainedNumber } from "src/Libraries/ConstrainedNumber";

export type SliderThumbWithTooltipProps<
  STEP extends number,
  MIN extends number,
  MAX extends number
> = {
  value: ConstrainedNumber<STEP, MIN, MAX>;
  setValue: (value: ConstrainedNumber<STEP, MIN, MAX>) => void;
};

export default function SliderThumbWithTooltip<
  STEP extends number,
  MIN extends number,
  MAX extends number
>(props: SliderThumbWithTooltipProps<STEP, MIN, MAX>) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <Slider
      width={"100%"}
      value={props.value.value}
      min={props.value.min}
      max={props.value.max}
      step={props.value.step}
      variant="brutalist"
      colorScheme="blackAlpha"
      onChange={(v) => {
        props.setValue(props.value.update(v));
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderTrack bg="blackAlpha.400">
        <SliderFilledTrack bg="blackAlpha.900" />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="purple.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={`${props.value.value}`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}
