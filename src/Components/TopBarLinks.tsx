import {
  HStack,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Menu,
  Link,
  BoxProps,
} from "@chakra-ui/react";
import IconButtonLink from "./IconButtonLink";
import * as Icon from "src/Components/Icon";
import { Link as ReachLink } from "react-router-dom";
export default function TopBarLinks(props: BoxProps): JSX.Element {
  return (
    <HStack
      position="fixed"
      top={4}
      right={4}
      p={1}
      rounded={8}
      {...props}
      spacing={1}
    >
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          rightIcon={<Icon.CaretDown />}
          aria-label="Social Media Links"
        >
          Links
        </MenuButton>
        <MenuList>
          <Link
            href="https://github.com/honungsburk/generative-studios"
            isExternal
          >
            <MenuItem icon={<Icon.Github />}>Github</MenuItem>
          </Link>

          <Link href="https://www.frankhampusweslien.com/" isExternal>
            <MenuItem icon={<Icon.Website />}>Personal Website</MenuItem>
          </Link>

          <Link href="https://twitter.com/HampusFrank" isExternal>
            <MenuItem icon={<Icon.Twitter />}>Twitter</MenuItem>
          </Link>
          <Link
            href="https://www.youtube.com/channel/UC6fuoBfK8_B_cT35aKuJEgg"
            isExternal
          >
            <MenuItem icon={<Icon.Youtube />}>Youtube</MenuItem>
          </Link>

          <Link href="https://www.instagram.com/frankhampusweslien/" isExternal>
            <MenuItem icon={<Icon.Instagram />}>Instagram</MenuItem>
          </Link>
        </MenuList>
      </Menu>
      <Button variant="ghost" to="/license" aria-label="license" as={ReachLink}>
        License
      </Button>
      <IconButtonLink
        variant="ghost"
        to="/home"
        aria-label="Home"
        icon={<Icon.Home />}
      />
    </HStack>
  );
}
