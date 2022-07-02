import { Container, VStack, Text } from "@chakra-ui/react";
import TextLink from "src/Components/TextLink";

export default function About(): JSX.Element {
  return (
    <Container mt={32} maxW="container.sm">
      <VStack>
        <Text fontSize={"3xl"}>ABOUT</Text>
        <Text>
          Generative Studios is an{" "}
          <TextLink href="https://github.com/honungsburk/generative-studios">
            opensource
          </TextLink>{" "}
          generative art project created by{" "}
          <TextLink href="https://twitter.com/HampusFrank">
            Frank Hampus Weslien
          </TextLink>
          . Interact, explore, and share!
        </Text>
      </VStack>
    </Container>
  );
}
