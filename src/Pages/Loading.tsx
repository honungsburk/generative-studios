import { Center, Text, Spinner, VStack } from "@chakra-ui/react";

/**
 * When pages are downloaded for the first time we show this loading screen.
 *
 * @returns the loading page
 */
export default function Loading(): JSX.Element {
  return (
    <Center height={"100vh"}>
      <VStack>
        <Spinner color="black" size="xl" thickness="8px" />
        <Text fontSize={12} fontWeight={"bold"}>
          LOADING...
        </Text>
      </VStack>
    </Center>
  );
}
