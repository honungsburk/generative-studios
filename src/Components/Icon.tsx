import { Icon, IconProps } from "@chakra-ui/react";
import {
  AiOutlineMenu,
  AiFillHome,
  AiFillLock,
  AiFillBug,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";

import {
  MdShare,
  MdTune,
  MdHeadphones,
  MdMic,
  MdMouse,
  MdLocationOn,
  MdFullscreen,
  MdFullscreenExit,
} from "react-icons/md";

// Menu

export function Menu(props: IconProps) {
  return <Icon {...props} as={AiOutlineMenu} />;
}

// Side Bar

export function Home(props: IconProps) {
  return <Icon {...props} as={AiFillHome} />;
}

export function Permissions(props: IconProps) {
  return <Icon {...props} as={AiFillLock} />;
}

export function Debug(props: IconProps) {
  return <Icon {...props} as={AiFillBug} />;
}

export function Share(props: IconProps) {
  return <Icon {...props} as={MdShare} />;
}

export function Tune(props: IconProps) {
  return <Icon {...props} as={MdTune} />;
}

// Navigation

export function Left(props: IconProps) {
  return <Icon {...props} as={AiOutlineLeft} />;
}

export function Right(props: IconProps) {
  return <Icon {...props} as={AiOutlineRight} />;
}

// Interactions

export function Headphones(props: IconProps) {
  return <Icon {...props} as={MdHeadphones} />;
}

export function Mic(props: IconProps) {
  return <Icon {...props} as={MdMic} />;
}

export function Mouse(props: IconProps) {
  return <Icon {...props} as={MdMouse} />;
}

export function Location(props: IconProps) {
  return <Icon {...props} as={MdLocationOn} />;
}

// Full Screen

export function Fullscreen(props: IconProps) {
  return <Icon {...props} as={MdFullscreen} />;
}

export function FullscreenExit(props: IconProps) {
  return <Icon {...props} as={MdFullscreenExit} />;
}
