import { IconButton, Link, IconButtonProps } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";

type IconButtonLinkProps = {
  to: string;
} & IconButtonProps;

export default function IconButtonLink({ to, ...rest }: IconButtonLinkProps) {
  return (
    <Link as={ReachLink} to={to}>
      <IconButton {...rest} />
    </Link>
  );
}
