import {
  Box,
  HStack,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Menu,
  Link,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import IconButtonLink from "./Components/IconButtonLink";
import * as Icon from "src/Components/Icon";

export default function Layout() {
  return (
    <Box>
      <HStack position="absolute" top={4} right={4}>
        <Menu>
          <MenuButton
            as={Button}
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

            <Link
              href="https://www.instagram.com/frankhampusweslien/"
              isExternal
            >
              <MenuItem icon={<Icon.Instagram />}>Instagram</MenuItem>
            </Link>
          </MenuList>
        </Menu>
        <IconButtonLink to="/home" aria-label="Home" icon={<Icon.Home />} />
      </HStack>
      <Outlet />
    </Box>
  );
}
