import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopBarLinks from "./Components/TopBarLinks";

export default function Layout() {
  return (
    <Box>
      <TopBarLinks />
      <Outlet />
    </Box>
  );
}
