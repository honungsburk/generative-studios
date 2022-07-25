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
import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "src/Hooks/useWindowDimensions";
import Sidebar from "./Sidebar";
import { useFullscreen } from "src/Hooks/useFullscreen";

type GenerativeStudioProps = {
  name: string;
  tuneTab: React.ReactNode;
  aboutTab: React.ReactNode;
  onGenerateRandomClick: () => void;
  onDownload: (
    width: number,
    height: number,
    name: string,
    format: "jpeg" | "png"
  ) => void;
  onAnimate?: (animate: boolean) => void;
  children: React.ReactNode;
};

const hotkeys = {
  drawerToggle: "s",
  hideGUI: "h",
  randomArtwork: "r",
  canvas: "c",
  fullscreen: "f",
  download: "d",
} as const;

export default function GenerativeStudio({
  name,
  tuneTab,
  aboutTab,
  onGenerateRandomClick,
  onDownload,
  children,
}: GenerativeStudioProps): JSX.Element {
  useNoBodyOverflow();
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useBreakpointValue({ md: true, base: false });
  const windowDimensions = useWindowDimensions();
  const [isAnimated, setIsAnimated] = useBoolean(false);
  const [isOpen, setIsOpen] = useBoolean(false);
  const [showGUI, setShowGUI] = useBoolean(true);
  // const [isFullScreen, setIsFullScreen] = useBoolean(false);
  const [isCanvas, setIsCanvas] = useBoolean(true);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [isFullScreen, fullscreenActions] = useFullscreen(drawerRef);

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

  useHotkeys(hotkeys.canvas, (event) => {
    event.preventDefault();
    setIsCanvas.toggle();
  });

  useHotkeys(hotkeys.fullscreen, (event) => {
    event.preventDefault();
    fullscreenActions.toggle();
  });

  const download = () => {
    if (isCanvas) {
      onDownload(
        Math.floor(windowDimensions.width * window.devicePixelRatio),
        Math.floor(windowDimensions.height * window.devicePixelRatio),
        "Example",
        "jpeg"
      );
    } else {
      onDownload(width, height, "Example", "jpeg");
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
      bg={"background.light"}
      width="100%"
      ref={drawerRef}
      isOpen={isDesktop !== undefined && isDesktop && isOpen && showGUI}
      drawer={
        <Sidebar
          close={setIsOpen.off}
          width="400px"
          name={name}
          tuneTab={tuneTab}
          aboutTab={aboutTab}
        />
      }
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
            isCanvas={isCanvas}
            onCanvasChange={setIsCanvas.toggle}
            isFullScreen={isFullScreen}
            onFullScreenChange={() => fullscreenActions.toggle()}
            isVisible={isOpen}
            onVisibleChange={() => setShowGUI.toggle()}
          />

          <Hidden isHidden={isCanvas}>
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
          width={isCanvas ? "100%" : `${canvasDims.width}px`}
          height={isCanvas ? "100%" : `${canvasDims.height}px`}
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
  isCanvas?: boolean;
  onCanvasChange?: (v: boolean) => void;
  isFullScreen?: boolean;
  onFullScreenChange?: (v: boolean) => void;
  onDownload?: () => void;
} & BoxProps;

function CanvasControlls({
  isMobile,
  isVisible,
  onVisibleChange,
  isCanvas,
  onCanvasChange,
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
        label={<WithShortCut label="Canvas" shortcut={[hotkeys.canvas]} />}
      >
        <Box>
          <ToggleButton
            variant={"ghost"}
            on={<Icon.Dimensions />}
            off={<Icon.Dimensions />}
            aria-label="Canvas dimensions"
            value={isCanvas}
            onChange={onCanvasChange}
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
