import {
  Flex,
  Heading,
  Spacer,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  BoxProps,
} from "@chakra-ui/react";
import * as Icon from "./Icon";

export default function Sidebar(props: {
  width: BoxProps["width"];
  name: string;
  tuneTab: React.ReactNode;
  aboutTab: React.ReactNode;
  close: () => void;
}) {
  const totalHeight = 116; //headerHeight + tabListHeight + 32; // add margin as well

  return (
    <Flex
      alignItems={"left"}
      width={props.width}
      height="100vh"
      direction={"column"}
      overflow={"hidden"}
    >
      <Flex align={"center"} m={4}>
        <Heading fontSize={28}>{props.name}</Heading>
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
          <TabPanel padding={0}>{props.tuneTab}</TabPanel>
          <TabPanel>{props.aboutTab}</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
