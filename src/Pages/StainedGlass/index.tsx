import React, { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import * as Algorithm from "./Algorithm";
import {
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  Input,
  IconButton,
  Divider,
  RadioGroup,
  Radio,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Tooltip,
  SliderThumb,
  Switch,
  Box,
} from "@chakra-ui/react";
import * as Icon from "src/Components/Icon";
import * as Palette from "src/Libraries/P5Extra/Palette";
import * as MathExtra from "src/Libraries/MathExtra";
import CoordinateInput from "src/Components/CoordinateInput";
import CosineColorInput from "src/Components/CosineColorInput";
import GradiantDisplay from "src/Components/GradiantDisplay";
import Folder from "src/Components/Folder";
import Drawer from "src/Components/Drawer";

const initSeed = Algorithm.generateSeed();
const initSettings = Algorithm.generateSettings(initSeed);

// TODO: add ResizeObserver

export default function StainedGlass() {
  const [seed, setSeed] = React.useState(initSeed);
  const [settings, setSettings] = React.useState(initSettings);

  // TODO: make dynamic!
  const sidebarWidth = 0;

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth - sidebarWidth, p5.windowHeight);
  };

  return (
    <Drawer
      drawer={
        <Sidebar
          width={400}
          tuneProps={{
            seed: seed,
            setSeed: setSeed,
            settings: settings,
            setSettings: setSettings,
          }}
        />
      }
    >
      <Box backgroundColor={"red.500"} width="100%" height={"100%"}>
        <Text>Hello, World!</Text>
      </Box>
      {/* <Sketch
        setup={Algorithm.setup(sidebarWidth)}
        draw={Algorithm.draw(seed, settings)}
        windowResized={windowResized}
      /> */}
    </Drawer>
  );
}

function Sidebar(props: { width: number; tuneProps: TuneProps }) {
  return (
    <VStack alignItems={"left"} width={`${props.width}px`}>
      <Heading fontSize={28} m={4}>
        Stained Glass
      </Heading>

      <Tabs size="md" colorScheme={"blackAlpha"} variant="brutalist">
        <TabList>
          <Tab>
            <Icon.Tune boxSize={6} />
          </Tab>
          <Tab>
            <Icon.Home boxSize={6} />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TuneTab {...props.tuneProps} />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}

type TuneProps = {
  setSeed: (seed: string) => void;
  seed: string;
  settings: Algorithm.Settings;
  setSettings: (settings: Algorithm.Settings) => void;
};

function TuneTab(props: TuneProps): JSX.Element {
  const [position, setPosition] = useState([100, 100]);

  return (
    <VStack align={"left"}>
      <GradiantDisplay
        width={300}
        height={20}
        colorFn={(t: number) => [t, t, t, 255]}
        start={0}
        end={255}
      />
      <CosineColorInput width={300} height={100} bgColor="blackAlpha.200" />
      <HStack>
        <IconButton
          variant={"brutalist"}
          colorScheme={"blackAlpha"}
          aria-label="Random Seed"
          icon={<Icon.Random />}
          onClick={() => props.setSeed(Algorithm.generateSeed())}
        />
        <Input
          variant="brutalist"
          colorScheme={"blackAlpha"}
          placeholder="Seed"
          value={props.seed}
          onChange={(e) => {
            props.setSeed(e.target.value);
          }}
        />
      </HStack>
      <Folder
        label="Splitting Strategy"
        info="Determines how a triangle is split into two new triangles"
      >
        <RadioGroup
          onChange={(strat) => {
            const newSettings = { ...props.settings };
            newSettings.splittingStrategy = strat as any;
            props.setSettings(newSettings);
          }}
          value={props.settings.splittingStrategy}
        >
          <VStack direction="row" align={"left"}>
            <Radio value={Algorithm.SPLITRANDOM}>Split Randomly</Radio>
            <Radio value={Algorithm.SPLITRANDOMBALANCED}>
              Split Randomly (Balanced)
            </Radio>
            <Radio value={Algorithm.SPLITMIDDLE}>Split Middle</Radio>
          </VStack>
        </RadioGroup>
      </Folder>
      <Folder
        label="Depth Strategy"
        info="Determines when a triangle is split into two"
      >
        <DepthStrat
          strategy={props.settings.depthStrategy}
          setStrategy={(newStrat) => {
            const newSettings = { ...props.settings };
            newSettings.depthStrategy = newStrat;
            props.setSettings(newSettings);
          }}
        />
      </Folder>

      <Folder
        label="Distance Strategy"
        info="Determines the color of a triangle by taking taking the distance of the tringle to some other point on the canvas"
      >
        <DistanceStrat
          strategy={props.settings.distStrategy}
          setStrategy={(newStrat) => {
            const newSettings = { ...props.settings };
            newSettings.distStrategy = newStrat;
            props.setSettings(newSettings);
          }}
        />
      </Folder>
      <Folder label="Jitter" info="Add randomness to the distance metric">
        <SliderThumbWithTooltip
          value={props.settings.jitter}
          min={0}
          max={1}
          step={0.01}
          setValue={(jitter) => {
            const copy = {
              ...props.settings,
            };
            copy.jitter = jitter;
            props.setSettings(copy);
          }}
        />
      </Folder>
      <Folder label="Symmetry" info="Make it symmetric across the diagonal">
        <Switch
          // colorScheme="blackAlpha"
          isChecked={props.settings.symmetry}
          value={props.settings.symmetry ? "false" : "true"}
          onChange={(symmetry) => {
            const copy = {
              ...props.settings,
            };
            copy.symmetry = "true" === symmetry.target.value;
            props.setSettings(copy);
          }}
        />
      </Folder>
      <Folder
        label="Color"
        info="Three cosine waves are combined to create gradiants, one for each channel (red, green, blue a.k.a. rgb)"
      >
        <CosinePalette
          palette={props.settings.palette}
          setPalette={(newPalette) => {
            const copy = {
              ...props.settings,
            };
            copy.palette = newPalette;
            props.setSettings(copy);
          }}
        />
      </Folder>
    </VStack>
  );
}

function DepthStrat(props: {
  strategy: Algorithm.DepthStrategy;
  setStrategy: (strat: Algorithm.DepthStrategy) => void;
}) {
  let extraOptions = <></>;

  if (props.strategy.kind === "Flip Depth") {
    extraOptions = (
      <>
        <SliderWithLabel
          label="P"
          value={props.strategy.p}
          min={0}
          max={1}
          step={0.01}
          setValue={(p) => {
            const copy = {
              ...props.strategy,
            } as Algorithm.FlipDepthStrategy;
            copy.p = p;
            props.setStrategy(copy);
          }}
        />
        <SliderWithLabel
          label="Depth"
          value={props.strategy.depth}
          min={1}
          max={7}
          step={1}
          setValue={(depth) => {
            const copy = {
              ...props.strategy,
            } as Algorithm.FlipDepthStrategy;
            copy.depth = depth;
            props.setStrategy(copy);
          }}
        />
      </>
    );
  } else if (props.strategy.kind === "Inherited Depth") {
    extraOptions = (
      <SliderWithLabel
        label="Depth"
        value={props.strategy.depth}
        min={1}
        max={4}
        step={1}
        setValue={(depth) => {
          const copy = {
            ...props.strategy,
          } as Algorithm.InheritedDepthStrategy;
          copy.depth = depth;
          props.setStrategy(copy);
        }}
      />
    );
  } else if (props.strategy.kind === "Max Depth") {
    extraOptions = (
      <SliderWithLabel
        label="Depth"
        value={props.strategy.maxDepth}
        min={1}
        max={12}
        step={1}
        setValue={(maxDepth) => {
          const copy = {
            ...props.strategy,
          } as Algorithm.MaxDepthStrategy;
          copy.maxDepth = maxDepth;
          props.setStrategy(copy);
        }}
      />
    );
  }

  return (
    <VStack align={"left"}>
      <Select
        variant="filled"
        onChange={(strat) => {
          props.setStrategy(
            Algorithm.getDepthStrategy(strat.target.value as any)
          );
        }}
        value={props.strategy.kind}
      >
        <option value={Algorithm.MaxDepthStrategy(9).kind}>Max Depth</option>
        <option value={Algorithm.FlipDepthStrategy(0.03, 5).kind}>
          Coin Flip Depth
        </option>
        <option value={Algorithm.InheritedDepthStrategy(4).kind}>
          Inherited Depth
        </option>
      </Select>
      {extraOptions}
    </VStack>
  );
}

function DistanceStrat(props: {
  strategy: Algorithm.DistanceStrategy;
  setStrategy: (strat: Algorithm.DistanceStrategy) => void;
}) {
  const size = 200;
  return (
    <VStack align={"left"}>
      <Select
        variant="filled"
        onChange={(strat) => {
          props.setStrategy(
            Algorithm.getDistanceStrategy(strat.target.value as any)
          );
        }}
        value={props.strategy.kind}
      >
        <option value={Algorithm.XCentroid.kind}>X-Axis</option>
        <option value={Algorithm.YCentroid.kind}>Y-Axis</option>
        <option value={Algorithm.DistToPoint(0.5, 0.5).kind}>
          Distance To Point
        </option>
      </Select>
      {props.strategy.kind === "Dist to Point" ? (
        <CoordinateInput
          width={size}
          height={size}
          bgColor="blackAlpha.200"
          onPosition={(x: number, y: number) => {
            const copy = {
              ...props.strategy,
            } as Algorithm.DistanceToPointStrategy;
            copy.x = x / size;
            copy.y = y / size;
            props.setStrategy(copy);
          }}
          x={(props.strategy.x * size) as number}
          y={(props.strategy.y * size) as number}
        />
      ) : (
        <></>
      )}
    </VStack>
  );
}

{
  /* <>
<SliderWithLabel
  label="X-Axis"
  value={props.strategy.x as number}
  min={0}
  max={1}
  step={0.01}
  setValue={(x) => {
    const copy = {
      ...props.strategy,
    } as Algorithm.DistanceToPointStrategy;
    copy.x = x;
    props.setStrategy(copy);
  }}
/>
<SliderWithLabel
  label="Y-Axis"
  value={props.strategy.y as number}
  min={0}
  max={1}
  step={0.01}
  setValue={(y) => {
    const copy = {
      ...props.strategy,
    } as Algorithm.DistanceToPointStrategy;
    copy.y = y;
    props.setStrategy(copy);
  }}
/>
</> */
}

function CosinePalette(props: {
  palette: Palette.CosinePalette;
  setPalette: (palette: Palette.CosinePalette) => void;
}) {
  const colorPicker = (key: "red" | "green" | "blue") => {
    return (
      <>
        <Text fontSize="sm" whiteSpace={"nowrap"}>
          {key}
        </Text>
        <SliderWithLabel
          label="a"
          value={props.palette[key].a}
          min={0}
          max={1}
          step={0.01}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.CosineColor;
            colorCopy.a = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.CosinePalette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
        <SliderWithLabel
          label="b"
          value={props.palette[key].b}
          min={0}
          max={1}
          step={0.01}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.CosineColor;
            colorCopy.b = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.CosinePalette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
        <SliderWithLabel
          label="c"
          value={props.palette[key].c}
          min={0}
          max={1}
          step={0.01}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.CosineColor;
            colorCopy.c = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.CosinePalette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
        <SliderWithLabel
          label="d"
          value={props.palette[key].d}
          min={0}
          max={1}
          step={0.01}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.CosineColor;
            colorCopy.d = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.CosinePalette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
      </>
    );
  };

  return (
    <VStack align={"left"}>
      {colorPicker("red")} {colorPicker("blue")} {colorPicker("green")}
      <Text fontSize="sm" whiteSpace={"nowrap"}>
        Mode
      </Text>
      <RadioGroup
        onChange={(newMode) => {
          const newSettings = { ...props.palette } as Palette.CosinePalette;
          newSettings.mode = newMode as Palette.ConsineMode;
          props.setPalette(newSettings);
        }}
        value={props.palette.mode}
      >
        <VStack direction="row" align={"left"}>
          <Radio value={"SMOOTH"}>Smooth</Radio>
          <Radio value={"MOD"}>Sharp</Radio>
        </VStack>
      </RadioGroup>
    </VStack>
  );
}

/////////////// Components

function SliderWithLabel(
  props: {
    label: string;
  } & SliderThumbWithTooltipProps
) {
  const { label, ...rest } = props;
  return (
    <HStack>
      <Text fontSize="sm" whiteSpace={"nowrap"}>
        {label}
      </Text>
      <SliderThumbWithTooltip {...rest} />
    </HStack>
  );
}

type SliderThumbWithTooltipProps = {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

function SliderThumbWithTooltip(props: SliderThumbWithTooltipProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const value = MathExtra.round(props.value, 0.01);
  return (
    <Slider
      width={"100%"}
      value={value}
      min={props.min}
      max={props.max}
      step={props.step}
      colorScheme="blackAlpha"
      onChange={(v) => {
        props.setValue(v);
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="teal.500"
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
