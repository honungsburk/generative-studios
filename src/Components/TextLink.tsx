import { Link, LinkProps } from "@chakra-ui/react";

export default function TextLink(props: LinkProps): JSX.Element {
  return <Link color={"purple"} isExternal {...props} />;
}
