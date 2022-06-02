import { Icon, IconProps } from "@chakra-ui/react";
import {
  AiOutlineMenu,
  AiFillHome,
  AiFillLock,
  AiFillBug,
  AiOutlineLeft,
  AiOutlineRight,
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillCaretLeft,
  AiFillCaretRight,
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
  MdInfo,
  MdRefresh,
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

// Tune Tab

export function Random(props: IconProps) {
  return <Icon {...props} as={MdRefresh} />;
}

export function Info(props: IconProps) {
  return <Icon {...props} as={MdInfo} />;
}

// Carret

export function CaretDown(props: IconProps) {
  return <Icon {...props} as={AiFillCaretDown} />;
}
export function CaretUp(props: IconProps) {
  return <Icon {...props} as={AiFillCaretUp} />;
}
export function CaretLeft(props: IconProps) {
  return <Icon {...props} as={AiFillCaretLeft} />;
}
export function CaretRight(props: IconProps) {
  return <Icon {...props} as={AiFillCaretRight} />;
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
