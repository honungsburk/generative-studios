import {
  Box,
  BoxProps,
  HStack,
  IconButton,
  Stack,
  Tooltip,
  Text,
  useBoolean,
  useBreakpointValue,
  Kbd,
  Center,
  Input,
  Flex,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import useNoBodyOverflow from "src/Hooks/useNoBodyOverflow";
import Drawer from "./Drawer";
import Hidden from "./Hidden";
import * as Icon from "./Icon";
import { useHotkeys } from "react-hotkeys-hook";
import { ToggleButton } from "./ToggleButton";
import * as Util from "src/Util";
import TopBarLinks from "./TopBarLinks";
import { useState } from "react";
import useWindowDimensions from "src/Hooks/useWindowDimensions";

type GenerativeStudioProps = {
  drawer: (close: () => void) => JSX.Element;
  onGenerateRandomClick: () => void;
  onDownload: (
    width: number,
    height: number,
    name: string,
    format: "jpg" | "png"
  ) => void;
  children: React.ReactElement;
};

const hotkeys = {
  drawerToggle: "s",
  hideGUI: "h",
  randomArtwork: "r",
  fullscreen: "f",
  download: "d",
} as const;

export default function GenerativeStudio({
  drawer,
  onGenerateRandomClick,
  onDownload,
  children,
}: GenerativeStudioProps): JSX.Element {
  useNoBodyOverflow();
  const isDesktop = useBreakpointValue({ md: true, base: false });
  const windowDimensions = useWindowDimensions();
  const [isOpen, setIsOpen] = useBoolean(false);
  const [showGUI, setShowGUI] = useBoolean(true);
  const [isFullScreen, setIsFullScreen] = useBoolean(true);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  const canvasDims = Util.fitToDimensions(
    windowDimensions.width,
    windowDimensions.height,
    width,
    height
  );

  // Hot Keys
  useHotkeys(hotkeys.drawerToggle, (event) => {
    event.preventDefault();
    setIsOpen.toggle();
  });
  useHotkeys(hotkeys.hideGUI, (event) => {
    event.preventDefault();
    setShowGUI.toggle();
  });

  useHotkeys(hotkeys.randomArtwork, (event) => {
    event.preventDefault();
    onGenerateRandomClick();
  });

  useHotkeys(hotkeys.fullscreen, (event) => {
    event.preventDefault();
    setIsFullScreen.toggle();
  });

  const download = () => {
    if (isFullScreen) {
      onDownload(
        Math.floor(windowDimensions.width * window.devicePixelRatio),
        Math.floor(windowDimensions.height * window.devicePixelRatio),
        "Example",
        "jpg"
      );
    } else {
      onDownload(width, height, "Example", "jpg");
    }
  };

  useHotkeys(
    hotkeys.download,
    (event) => {
      event.preventDefault();
      download();
    },
    [onDownload, width, height]
  );

  return (
    <Drawer
      isOpen={isDesktop !== undefined && isDesktop && isOpen && showGUI}
      drawer={drawer(setIsOpen.off)}
    >
      <Center
        width={"100%"}
        height="100vh"
        maxHeight={"100vh"}
        maxWidth="100%"
        background={"blackAlpha.300"}
      >
        <Hidden isHidden={!showGUI || isOpen || !isDesktop}>
          <Box
            layerStyle={"frostedglass"}
            rounded={8}
            position="fixed"
            top={4}
            left={4}
          >
            <Tooltip
              placement="right"
              label={
                <WithShortCut
                  label="Drawer"
                  shortcut={[hotkeys.drawerToggle]}
                />
              }
            >
              <Box>
                <IconButton
                  variant={"ghost"}
                  aria-label="Open Drawer"
                  icon={<Icon.Right />}
                  onClick={() => setIsOpen.on()}
                />
              </Box>
            </Tooltip>
          </Box>
        </Hidden>

        <Hidden isHidden={!showGUI}>
          <TopBarLinks layerStyle="frostedglass" />

          <CanvasControlls
            isMobile={!(isDesktop == true)}
            onGenerateRandomClick={onGenerateRandomClick}
            position="fixed"
            right={4}
            bottom={16}
            onDownload={download}
            isFullScreen={isFullScreen}
            onFullScreenChange={() => setIsFullScreen.toggle()}
            isVisible={isOpen}
            onVisibleChange={() => setShowGUI.toggle()}
          />

          <Hidden isHidden={isFullScreen}>
            <CanvasDimensionsInput
              widthValue={width}
              setWidthValue={setWidth}
              heightValue={height}
              setHeightValue={setHeight}
              position="fixed"
              right={"50%"}
              bottom={4}
              transform="auto"
              translateX="50%"
            />
          </Hidden>
        </Hidden>
        <Box
          width={isFullScreen ? "100%" : `${canvasDims.width}px`}
          height={isFullScreen ? "100%" : `${canvasDims.height}px`}
        >
          {children}
        </Box>
      </Center>
    </Drawer>
  );
}

type RightSideButtonsProps = {
  isMobile: boolean;
  onGenerateRandomClick: () => void;
  isVisible?: boolean;
  onVisibleChange?: (v: boolean) => void;
  isFullScreen?: boolean;
  onFullScreenChange?: (v: boolean) => void;
  onDownload?: () => void;
} & BoxProps;

function CanvasControlls({
  isMobile,
  isVisible,
  onVisibleChange,
  isFullScreen,
  onFullScreenChange,
  onDownload,
  onGenerateRandomClick,
  ...props
}: RightSideButtonsProps): JSX.Element {
  return (
    <Stack layerStyle="frostedglass" rounded={8} p={1} spacing={1} {...props}>
      <Hidden isHidden={isMobile}>
        <Tooltip
          label={<WithShortCut label="Hide" shortcut={[hotkeys.hideGUI]} />}
          placement="left"
        >
          <Box>
            <ToggleButton
              variant={"ghost"}
              value={isVisible}
              onChange={onVisibleChange}
              on={<Icon.EyeInvisible />}
              off={<Icon.Eye />}
              aria-label="Hide GUI"
            />
          </Box>
        </Tooltip>
      </Hidden>
      <Tooltip
        placement="left"
        label={
          <WithShortCut label="Fullscreen" shortcut={[hotkeys.fullscreen]} />
        }
      >
        <Box>
          <ToggleButton
            variant={"ghost"}
            on={<Icon.FullscreenExit />}
            off={<Icon.Fullscreen />}
            aria-label="Fullscreen on/off"
            value={isFullScreen}
            onChange={onFullScreenChange}
          />
        </Box>
      </Tooltip>
      <Tooltip
        placement="left"
        label={<WithShortCut label="Download" shortcut={[hotkeys.download]} />}
      >
        <Box>
          <IconButton
            variant={"ghost"}
            aria-label="Download"
            icon={<Icon.Download />}
            onClick={onDownload}
          />
        </Box>
      </Tooltip>

      <Tooltip
        placement="left"
        label={
          <WithShortCut label="Random" shortcut={[hotkeys.randomArtwork]} />
        }
      >
        <Box>
          <IconButton
            variant={"ghost"}
            aria-label="Random Artwork"
            icon={<Icon.Random />}
            onClick={onGenerateRandomClick}
          />
        </Box>
      </Tooltip>
    </Stack>
  );
}

function WithShortCut(props: {
  label: string;
  shortcut: string[];
}): JSX.Element {
  const res = [
    ...Util.intersperse(
      props.shortcut.map((v, index) => (
        <Kbd key={index} color="black">
          {v}
        </Kbd>
      )),
      "+"
    ),
  ];
  return (
    <HStack align={"center"} justify="center">
      <Text>{props.label}</Text>
      <Center height={"100%"}>
        <Flex>{res}</Flex>
      </Center>
    </HStack>
  );
}

type CanvasDimensionsInputProps = {
  widthValue: number;
  setWidthValue: (width: number) => void;
  heightValue: number;
  setHeightValue: (height: number) => void;
};

function CanvasDimensionsInput({
  widthValue,
  setWidthValue,
  heightValue,
  setHeightValue,
  ...rest
}: CanvasDimensionsInputProps & BoxProps): JSX.Element {
  const input = (value: number, setValue: (v: number) => void) => (
    <NumberInput
      variant={"filled"}
      w={100}
      min={0}
      precision={0}
      size={"sm"}
      rounded={8}
      value={value}
      onChange={(e, v) => setValue(v)}
    >
      <NumberInputField
        backgroundColor={"whiteAlpha.600"}
        _hover={{ backgroundColor: "whiteAlpha.800" }}
        _focus={{ backgroundColor: "whiteAlpha.800" }}
      />
    </NumberInput>
  );

  return (
    <HStack layerStyle={"frostedglass"} rounded={8} spacing={1} p={1} {...rest}>
      {input(widthValue, setWidthValue)}
      <Text>x</Text>
      {input(heightValue, setHeightValue)}

      <IconButton
        size={"sm"}
        aria-label="rotate canvas dimensions 90 degrees"
        variant={"ghost"}
        onClick={() => {
          setWidthValue(heightValue);
          setHeightValue(widthValue);
        }}
      >
        <Icon.Rotate />
      </IconButton>
    </HStack>
  );
}
