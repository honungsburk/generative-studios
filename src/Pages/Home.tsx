import {
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  LinkBox,
  LinkOverlay,
  Box,
} from "@chakra-ui/react";
import UserInteractionIcon from "../Components/UserInteractionIcon";
import * as Projects from "../Projects";

export default function Home() {
  return (
    <Stack align="center" mt={32} spacing={8}>
      <Stack align="center">
        <Heading>Generative Studios</Heading>;
        <Text>Anyone can make art. We do.</Text>
      </Stack>
      <SimpleGrid
        px={8}
        spacing={2}
        width={"100%"}
        minChildWidth={["300px", null, "400px"]}
      >
        {Projects.metadata.map((meta, index) => (
          <Box mx="auto" key={index}>
            <Project metadata={meta} />
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

function Project(props: { metadata: Projects.Metadata }) {
  return (
    <Stack>
      <LinkBox>
        <Stack>
          <Heading size="md">
            <LinkOverlay href={props.metadata.href}>
              {props.metadata.name}
            </LinkOverlay>
          </Heading>
          <Image
            rounded={8}
            objectFit="cover"
            src={props.metadata.thumbNailSrc}
            alt="Dan Abramov"
            fallbackSrc="https://via.placeholder.com/300"
          />
        </Stack>
      </LinkBox>
      <Stack direction={"row"} justify="end">
        {props.metadata.userInteractions.map((interaction, index) => (
          <UserInteractionIcon kind={interaction} boxSize={6} key={index} />
        ))}
      </Stack>
    </Stack>
  );
}
