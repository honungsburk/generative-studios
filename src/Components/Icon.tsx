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
  AiFillGithub,
  AiFillYoutube,
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillEyeInvisible,
  AiFillEye,
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
  MdOutlineRotate90DegreesCcw,
  MdFileDownload,
  MdSource,
} from "react-icons/md";

import { CgWebsite } from "react-icons/cg";

// Social Media

export function Github(props: IconProps) {
  return <Icon {...props} as={AiFillGithub} />;
}

export function Twitter(props: IconProps) {
  return <Icon {...props} as={AiFillTwitterCircle} />;
}

export function Youtube(props: IconProps) {
  return <Icon {...props} as={AiFillYoutube} />;
}

export function Instagram(props: IconProps) {
  return <Icon {...props} as={AiFillInstagram} />;
}

export function Website(props: IconProps) {
  return <Icon {...props} as={CgWebsite} />;
}

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

// Fullscreen

export function Fullscreen(props: IconProps) {
  return <Icon {...props} as={MdFullscreen} />;
}

export function FullscreenExit(props: IconProps) {
  return <Icon {...props} as={MdFullscreenExit} />;
}

// Visible

export function EyeInvisible(props: IconProps) {
  return <Icon {...props} as={AiFillEyeInvisible} />;
}

export function Eye(props: IconProps) {
  return <Icon {...props} as={AiFillEye} />;
}

export function Rotate(props: IconProps) {
  return <Icon {...props} as={MdOutlineRotate90DegreesCcw} />;
}

export function Download(props: IconProps) {
  return <Icon {...props} as={MdFileDownload} />;
}

// Info

export function About(props: IconProps) {
  return <Icon {...props} as={MdInfo} />;
}

export function License(props: IconProps) {
  return <Icon {...props} as={MdSource} />;
}
