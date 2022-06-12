import React, { useEffect } from "react";
import Sketch from "react-p5";
import * as Algorithm from "./Algorithm";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  IconButton,
  Box,
  Flex,
  useBoolean,
  Spacer,
  Link,
} from "@chakra-ui/react";
import * as Icon from "src/Components/Icon";
import Drawer from "src/Components/Drawer";
import useNoBodyOverflow from "src/Hooks/useNoBodyOverflow";
import * as ArtLink from "src/Libraries/ArtLink";
import { useSearchParams } from "react-router-dom";
import Hidden from "src/Components/Hidden";
import { TuneTabProps, TuneTab } from "./TuneTab";
import About from "./About";
import IconButtonLink from "src/Components/IconButtonLink";

export default function StainedGlass() {
  const [isOpen, setIsOpen] = useBoolean(false);

  const [settings, setSettings] = React.useState(() =>
    Algorithm.generateSettings(Algorithm.generateSeed())
  );
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

        <IconButtonLink
          to="/home"
          position="absolute"
          top={4}
          right={4}
          aria-label="Home"
          icon={<Icon.Home />}
        />

        <IconButton
          position="absolute"
          bottom={4}
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
  tuneProps: TuneTabProps;
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
            <About />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
