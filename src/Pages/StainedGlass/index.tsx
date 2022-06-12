import React, { useEffect, useState } from "react";
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
  Box,
  RadioGroup,
  Radio,
  Select,
  Switch,
  Flex,
  useBoolean,
  Spacer,
} from "@chakra-ui/react";
import * as Icon from "src/Components/Icon";
import * as Palette from "src/Libraries/P5Extra/Palette";
import * as MathExtra from "src/Libraries/MathExtra";
import CoordinateInput from "src/Components/CoordinateInput";
import CosineColorInput from "src/Components/CosineColorInput";
import GradiantDisplay from "src/Components/GradiantDisplay";
import Folder from "src/Components/Folder";
import Drawer from "src/Components/Drawer";
import Slider from "src/Components/Slider";
import useNoBodyOverflow from "src/Hooks/useNoBodyOverflow";
import Info from "src/Components/Info";
import * as ArtLink from "src/Libraries/ArtLink";
import { useSearchParams } from "react-router-dom";
import Hidden from "src/Components/Hidden";

export default function StainedGlass() {
  const [isOpen, setIsOpen] = useBoolean(false);

  const [settings, setSettings] = React.useState(() =>
    Algorithm.generateSettings(Algorithm.generateSeed())
  );
  // const [sidebarWidth, setSidebarWidth] = React.useState(400);
  const [canvasWidth, setCanvasWidth] = React.useState(400);
  const [canvasHeight, setCanvasHeight] = React.useState(400);

  useNoBodyOverflow();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const configBase64 = searchParams.get("artwork");
    if (configBase64) {
      const config = ArtLink.decode(configBase64);
      // TODO: add a typecheck here!
      if (config) {
        setSettings(config);
      }
    }
  }, []);

  useEffect(() => {
    setSearchParams({ version: "1", artwork: ArtLink.encode(settings) });
  }, [settings]);

  // TODO: create hook for this effect
  useEffect(() => {
    const canvasWrapper = document.getElementById("wrapped-canvas-resizer");
    const canvases = document.getElementsByClassName("p5Canvas");
    const canvas = canvases.item(0) as HTMLCanvasElement | null;

    if (canvasWrapper && canvas) {
      const resize = () => {
        setCanvasHeight(canvasWrapper.clientHeight);
        setCanvasWidth(canvasWrapper.clientWidth);
        canvas.width = canvasWrapper.clientWidth;
        canvas.height = canvasWrapper.clientHeight;
        canvas.style.width = `${canvasWrapper.clientWidth}px`;
        canvas.style.height = `${canvasWrapper.clientHeight}px`;
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvasWrapper);

      return () => observer.disconnect();
    }
  }, []);

  return (
    <Drawer
      // onOpen={() => setSidebarWidth(400)}
      // onClose={() => setSidebarWidth(0)}
      isOpen={isOpen}
      drawer={
        <Sidebar
          close={setIsOpen.off}
          width={400}
          tuneProps={{
            settings: settings,
            setSettings: setSettings,
          }}
        />
      }
    >
      <Box
        id="wrapped-canvas-resizer"
        width={"100%"}
        height="100vh"
        maxHeight={"100vh"}
        maxWidth="100%"
      >
        <Hidden isHidden={isOpen}>
          <IconButton
            position="absolute"
            top={4}
            left={4}
            aria-label="Open Side bar"
            icon={<Icon.Right />}
            onClick={() => setIsOpen.on()}
          />
        </Hidden>

        <IconButton
          position="absolute"
          top={4}
          right={4}
          aria-label="Random Seed"
          icon={<Icon.Random />}
          onClick={() =>
            setSettings(Algorithm.generateSettings(Algorithm.generateSeed()))
          }
        />
        <Sketch
          setup={Algorithm.setup(canvasWidth, canvasHeight)}
          draw={Algorithm.draw()(settings, canvasWidth, canvasHeight)}
          // windowResized={windowResized}
        />
      </Box>
    </Drawer>
  );
}

function Sidebar(props: {
  width: number;
  tuneProps: TuneProps;
  close: () => void;
}) {
  return (
    <Flex
      alignItems={"left"}
      width={`${props.width}px`}
      height="100vh"
      direction={"column"}
      overflow={"hidden"}
    >
      <Flex align={"center"} m={4}>
        <Heading fontSize={28}>Stained Glass</Heading>
        <Spacer />
        <IconButton
          variant={"brutalist-ghost"}
          colorScheme="blackAlpha"
          aria-label="Close Side bar"
          icon={<Icon.Left />}
          onClick={() => props.close()}
        />
      </Flex>

      <Tabs size="md" colorScheme={"blackAlpha"} variant="brutalist" flex="1">
        <TabList>
          <Tab>
            <Icon.Tune boxSize={6} />
          </Tab>
          <Tab>
            <Icon.Home boxSize={6} />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel overflowY={"scroll"} height="100vh" padding={0}>
            <TuneTab {...props.tuneProps} />
          </TabPanel>
          <TabPanel overflowY={"scroll"} height="100vh">
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

type TuneProps = {
  settings: Algorithm.Settings;
  setSettings: (settings: Algorithm.Settings) => void;
};

function TuneTab(props: TuneProps): JSX.Element {
  const [position, setPosition] = useState([100, 100]);

  return (
    <VStack align={"left"}>
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
        <Slider
          info="The amount of jitter (randomness) to add"
          label="Jitter"
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
        <Slider
          info="The probaility that there will be a flip"
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
        <Slider
          info="The maximum depth that can be flipped"
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
      <Slider
        info="The maximum number of times the triangles will be split"
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
      <Slider
        info="The maximum number of times the triangles will be split"
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
        <Slider
          info="The mean value of the cosinus wave"
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
        <Slider
          info="The amplitude of cosiuns wave"
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
        <Slider
          info="the frequency of the cosinus wave"
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
        <Slider
          info="the shift of the cosinus wave"
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
