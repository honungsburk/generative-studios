import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import * as MathExtra from "src/Libraries/MathExtra";

export type SliderThumbWithTooltipProps = {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

export default function SliderThumbWithTooltip(
  props: SliderThumbWithTooltipProps
) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const value = MathExtra.round(props.value, 0.01);
  return (
    <Slider
      width={"100%"}
      value={value}
      min={props.min}
      max={props.max}
      step={props.step}
      variant="brutalist"
      colorScheme="blackAlpha"
      onChange={(v) => {
        props.setValue(v);
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
        label={`${value}`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}
