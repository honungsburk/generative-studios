import { UserInteraction } from "./UserInteractions";
import AlgoMarbleThumbnail from "../Assets/Project/AlgoMarble-Thumbnail.jpg";
import StainedGlassThumbnail from "../Assets/Project/StainedGlass-Thumbnail.jpg";

/**
 * Metadata about a project. Used to render the GUI in /Home.
 */
export type Metadata = {
  name: string;
  href: string;
  thumbNailSrc: string;
  userInteractions: UserInteraction[];
};

export const metadata: Metadata[] = [
  // {
  //   name: "AlgoMarble",
  //   href: "/algomarble",
  //   thumbNailSrc: AlgoMarbleThumbnail,
  //   userInteractions: ["Mouse", "Audio"],
  // },
  {
    name: "Stained Glass",
    href: "/stained-glass",
    thumbNailSrc: StainedGlassThumbnail,
    userInteractions: [],
  },
];
