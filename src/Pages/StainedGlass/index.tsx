import React, { useEffect } from "react";
import * as Algorithm from "./Algorithm";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import * as Icon from "src/Components/Icon";
import { useSearchParams } from "react-router-dom";
import { TuneTabProps, TuneTab } from "./TuneTab";
import About from "./About";
import AdaptiveSketch from "src/Components/AdaptiveSketch";
import GenerativeStudio from "src/Components/GenerativeStudio";
import p5 from "p5";

export default function StainedGlass() {
  const [settings, setSettings] = React.useState(() =>
    Algorithm.generateSettings(Algorithm.generateSeed())
  );

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const configBase64 = searchParams.get("data");
      if (configBase64) {
        const config = await Algorithm.decode(configBase64);
        // TODO: add a typecheck here!
        if (config) {
          setSettings(config);
        }
      }
    };
    run();
  }, []);

  useEffect(() => {
    const encoding = Algorithm.encode(settings);
    setSearchParams({
      v: "1",
      data: encoding,
    });
  }, [settings]);

  return (
    <GenerativeStudio
      onDownload={(width, height, name, format) => {
        Algorithm.download(
          width,
          height,
          settings,
          name,
          format,
          new p5(() => {})
        );
      }}
      onGenerateRandomClick={() =>
        setSettings(Algorithm.generateSettings(Algorithm.generateSeed()))
      }
      drawer={(close) => (
        <Sidebar
          close={close}
          width={400}
          tuneProps={{
            settings: settings,
            setSettings: setSettings,
          }}
        />
      )}
    >
      <AdaptiveSketch
        setup={Algorithm.setup}
        draw={(w, h) => Algorithm.draw()(settings, w, h)} // TODO: fix memoization
      />
    </GenerativeStudio>
  );
}

function Sidebar(props: {
  width: number;
  tuneProps: TuneTabProps;
  close: () => void;
}) {
  const totalHeight = 116; //headerHeight + tabListHeight + 32; // add margin as well

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
        <TabPanels
          style={{ height: `calc(100vh - ${totalHeight}px)` }}
          overflowY={"auto"}
        >
          <TabPanel padding={0}>
            <TuneTab {...props.tuneProps} />
          </TabPanel>
          <TabPanel>
            <About />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
