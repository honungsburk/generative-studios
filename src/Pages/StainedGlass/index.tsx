import React from "react";
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
} from "@chakra-ui/react";
import * as Icon from "../../Components/Icon";
import * as Palette from "../../Libraries/P5Extra/Palette";

const initSeed = Algorithm.generateSeed();
const initSettings = Algorithm.generateSettings(initSeed);

export default function StainedGlass() {
  const [seed, setSeed] = React.useState(initSeed);
  const [settings, setSettings] = React.useState(initSettings);
  // Settings
  // const [splittingStrategy, setSplittingStrategy] = React.useState<Algorithm.SplitStrategy>(
  //   initSettings.splittingStrategy
  // );
  // const [depthStrategy, setDepthStrategy] = React.useState<Algorithm.DepthStrategy>(
  //   initSettings.depthStrategy
  // );
  // const [distStrategy, setDistStrategy] = React.useState<Algorithm.DistanceStrategy>(
  //   initSettings.distStrategy
  // );
  // const [jitter, setJitter] = React.useState(initSettings.jitter);
  // const [palette, setPalette] = React.useState(initSettings.palette);
  // const [symmetry, setSymmetry] = React.useState(initSettings.symmetry);

  // TODO: make dynamic!
  const sidebarWidth = 400;

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth - sidebarWidth, p5.windowHeight);
  };

  return (
    <HStack align={"top"} spacing={0}>
      <Sidebar
        width={sidebarWidth}
        tuneProps={{
          seed: seed,
          setSeed: setSeed,
          settings: settings,
          setSettings: setSettings,
        }}
      />
      <Sketch
        setup={Algorithm.setup(sidebarWidth)}
        draw={Algorithm.draw(seed, settings)}
        windowResized={windowResized}
      />
    </HStack>
  );
}

function Sidebar(props: { width: number; tuneProps: TuneProps }) {
  return (
    <VStack alignItems={"left"} width={`${props.width}px`}>
      <Heading fontSize={28} m={4}>
        Stained Glass
      </Heading>

      <Tabs size="md" colorScheme={"blackAlpha"}>
        <TabList>
          <Tab>
            <Icon.Tune boxSize={6} />
          </Tab>
          <Tab>
            <Icon.Home boxSize={6} />
          </Tab>
          <Tab>
            <Icon.Permissions boxSize={6} />
          </Tab>
          <Tab>
            <Icon.Debug boxSize={6} />
          </Tab>
          <Tab>
            <Icon.Share boxSize={6} />
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
  return (
    <VStack align={"left"}>
      <Text fontSize="lg">Seed</Text>
      <HStack>
        <IconButton
          colorScheme={"blackAlpha"}
          aria-label="Random Seed"
          icon={<Icon.Random />}
          onClick={() => props.setSeed(Algorithm.generateSeed())}
        />
        <Input
          variant="filled"
          placeholder="Seed"
          value={props.seed}
          onChange={(e) => {
            props.setSeed(e.target.value);
          }}
        />
      </HStack>
      <Text fontSize="lg">Splitting Strategy</Text>
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

      <Text fontSize="lg">Distance Strategy</Text>
      <RadioGroup
        onChange={(strat) => {
          const newSettings = { ...props.settings };
          newSettings.distStrategy = Algorithm.getDistanceStrategy(
            strat as any
          );
          console.log(strat);
          props.setSettings(newSettings);
        }}
        value={props.settings.distStrategy.kind}
      >
        <VStack direction="row" align={"left"}>
          <Radio value={Algorithm.XCentroid.kind}>X Centroid</Radio>
          <Radio value={Algorithm.YCentroid.kind}>Y Centroid</Radio>
          <Radio value={Algorithm.DistToPoint(0, 0).kind}>
            Distance To Point
          </Radio>
        </VStack>
      </RadioGroup>
    </VStack>
  );
}
