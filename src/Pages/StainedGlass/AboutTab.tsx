import { VStack, Text } from "@chakra-ui/react";
import TextLink from "src/Components/TextLink";

export default function AboutTab(): JSX.Element {
  return (
    <VStack>
      <Text>
        Stained Glass was my first real attempt at generative art. It took a lot
        of inspiration from the this{" "}
        <TextLink
          href={
            "https://tylerxhobbs.com/essays/2017/aesthetically-pleasing-triangle-subdivision"
          }
        >
          blog post
        </TextLink>{" "}
        by Tyler Hobbs. They were created by splitting triangles recursively,
        each with its own unique combination of how often a split occurs, how
        the triangles are split, and the color palette.
      </Text>
      <Text>
        The algorithm have gone through several iterations: the first version
        can be found in this{" "}
        <TextLink href={"https://github.com/honungsburk/Stained-Glass"}>
          git repository
        </TextLink>{" "}
        built using p5js. The{" "}
        <TextLink
          href={
            "https://github.com/honungsburk/generative-studios/blob/master/src/Pages/StainedGlass/Algorithm.ts"
          }
        >
          second version
        </TextLink>{" "}
        is much the same but adapted so as to run inside a this website.
      </Text>
      <Text>
        You can explore the algorithm by using the random button as well as
        changing the parameters in the 'Tune Tab'.
      </Text>
    </VStack>
  );
}
