import { VStack, Text } from "@chakra-ui/react";
import TextLink from "src/Components/TextLink";

export default function AboutTab(): JSX.Element {
  return (
    <VStack>
      <Text>
        AlgoMarble was my first foray into shader art. I took heavy inspiration
        this{" "}
        <TextLink href={"https://iquilezles.org/articles/warp/"}>
          article
        </TextLink>{" "}
        by Inigo Quilez. On how to use domain warping to produze organic looking
        textures.
      </Text>

      <Text>
        The basic idea was to stack layers of noise on top of each other until
        fantastical textures emerged. This is not a completely new idea but can
        trace its orgin back as far as 1983 with the invention of Perlin noise
        by Ken Perlin.{" "}
      </Text>

      <Text>
        The algorithm have gone through several iterations; the first version
        can be found in this{" "}
        <TextLink href={"https://github.com/honungsburk/AlgoMarble"}>
          git repository
        </TextLink>{" "}
        built using python and OpenGl. I had to create a{" "}
        <TextLink href={"https://github.com/honungsburk/AlgoMarbleWebGL"}>
          second version
        </TextLink>{" "}
        to be able to host it on this website using WebGL and finally a{" "}
        <TextLink
          href={
            "https://github.com/honungsburk/generative-studios/tree/master/src/Pages/AlgoMarble"
          }
        >
          third
        </TextLink>{" "}
        is the one running on this website
      </Text>
      <Text>
        You can explore the algorithm by using the random button as well as
        changing the parameters in the 'Tune Tab'.
      </Text>
    </VStack>
  );
}
