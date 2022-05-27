import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import * as Algorithm from "./Algorithm";
import {
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
} from "@chakra-ui/react";
import * as Icon from "../../Components/Icon";

const initSeed = Algorithm.generateSeed();

export default function StainedGlass() {
  const [seed, setSeed] = React.useState(initSeed);

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
        }}
      />
      <Sketch
        setup={Algorithm.setup(sidebarWidth)}
        draw={Algorithm.draw(seed)}
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
};

function TuneTab(props: TuneProps): JSX.Element {
  return (
    <VStack>
      <HStack>
        <IconButton
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
    </VStack>
  );
}
