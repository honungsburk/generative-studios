import {
  Heading,
  Text,
  Stack,
  Wrap,
  Image,
  LinkBox,
  LinkOverlay,
  WrapItem,
  Center,
} from "@chakra-ui/react";
import UserInteractionIcon from "../Components/UserInteractionIcon";
import * as Projects from "../Projects";

export default function Home() {
  return (
    <Stack align="center" mt={32} spacing={8}>
      <Stack align="center">
        <Heading>Generative Studios</Heading>;
        <Text>Generative art for the masses.</Text>
      </Stack>
      <Wrap justify="center" align="center" px={8} spacing={4}>
        {Projects.metadata.map((meta, index) => (
          <WrapItem key={index}>
            <Project metadata={meta} />
          </WrapItem>
        ))}
      </Wrap>
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
            alt={`Exampe of output from ${props.metadata.name}`}
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
