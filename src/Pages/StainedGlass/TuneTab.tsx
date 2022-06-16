import {
  Text,
  VStack,
  RadioGroup,
  Radio,
  Select,
  Switch,
} from "@chakra-ui/react";
import * as Palette from "src/Libraries/P5Extra/Palette";
import CoordinateInput from "src/Components/CoordinateInput";
import Folder from "src/Components/Folder";
import Slider from "src/Components/Slider";

// Algorithm Imports
import * as Algorithm from "./Algorithm";
import * as Depth from "./Algorithm/Strategy/Depth";
import * as DistanceStrategy from "./Algorithm/Strategy/Distance";
import * as JitterStrategy from "./Algorithm/Strategy/Jitter";
import * as PaletteStrategy from "./Algorithm/Strategy/Palette";
import * as SplitStrategy from "./Algorithm/Strategy/Split";

export type TuneTabProps = {
  settings: Algorithm.Settings;
  setSettings: (settings: Algorithm.Settings) => void;
};

export function TuneTab(props: TuneTabProps): JSX.Element {
  return (
    <VStack align={"left"}>
      <Folder
        label="Splitting Strategy"
        info="Determines how a triangle is split into two new triangles"
      >
        <RadioGroup
          onChange={(strat) => {
            const newSettings = { ...props.settings };
            newSettings.splittingStrategy = strat as any;
            props.setSettings(newSettings);
          }}
          value={props.settings.splittingStrategy}
        >
          <VStack direction="row" align={"left"}>
            <Radio value={SplitStrategy.RANDOM}>Split Randomly</Radio>
            <Radio value={SplitStrategy.RANDOM_BALANCED}>
              Split Randomly (Balanced)
            </Radio>
            <Radio value={SplitStrategy.MIDDLE}>Split Middle</Radio>
          </VStack>
        </RadioGroup>
      </Folder>
      <Folder
        label="Depth Strategy"
        info="Determines when a triangle is split into two"
      >
        <DepthStrat
          strategy={props.settings.depthStrategy}
          setStrategy={(newStrat) => {
            const newSettings = { ...props.settings };
            newSettings.depthStrategy = newStrat;
            props.setSettings(newSettings);
          }}
        />
      </Folder>

      <Folder
        label="Distance Strategy"
        info="Determines the color of a triangle by taking taking the distance of the tringle to some other point on the canvas"
      >
        <DistanceStrat
          strategy={props.settings.distStrategy}
          setStrategy={(newStrat) => {
            const newSettings = { ...props.settings };
            newSettings.distStrategy = newStrat;
            props.setSettings(newSettings);
          }}
        />
      </Folder>
      <Folder label="Jitter" info="Add randomness to the distance metric">
        <Slider
          info="The amount of jitter (randomness) to add"
          label="Jitter"
          value={props.settings.jitter}
          setValue={(jitter) => {
            const copy = {
              ...props.settings,
            };
            copy.jitter = jitter;
            props.setSettings(copy);
          }}
        />
      </Folder>
      <Folder label="Symmetry" info="Make it symmetric across the diagonal">
        <Switch
          // colorScheme="blackAlpha"
          isChecked={props.settings.symmetry}
          value={props.settings.symmetry ? "false" : "true"}
          onChange={(symmetry) => {
            const copy = {
              ...props.settings,
            };
            copy.symmetry = "true" === symmetry.target.value;
            props.setSettings(copy);
          }}
        />
      </Folder>
      <Folder
        label="Color"
        info="Three cosine waves are combined to create gradiants, one for each channel (red, green, blue a.k.a. rgb)"
      >
        <CosinePalette
          palette={props.settings.palette}
          setPalette={(newPalette) => {
            const copy = {
              ...props.settings,
            };
            copy.palette = newPalette;
            props.setSettings(copy);
          }}
        />
      </Folder>
    </VStack>
  );
}

function DepthStrat(props: {
  strategy: Depth.Strategy;
  setStrategy: (strat: Depth.Strategy) => void;
}) {
  let extraOptions = <></>;

  if (Depth.isFlipDepthStrategy(props.strategy)) {
    const strategy = props.strategy;
    extraOptions = (
      <>
        <Slider
          info="The probaility that there will be a flip"
          label="P"
          value={props.strategy.p}
          setValue={(p) => {
            props.setStrategy(strategy.update(p));
          }}
        />
        <Slider
          info="The maximum depth that can be flipped"
          label="Depth"
          value={strategy.maxDepth}
          setValue={(depth) => {
            props.setStrategy(strategy.update(undefined, depth));
          }}
        />
      </>
    );
  } else if (Depth.isInheritedDepthStrategy(props.strategy)) {
    const strategy = props.strategy;
    extraOptions = (
      <Slider
        info="The minimum number of times the triangles will be split"
        label="Depth"
        value={strategy.minDepth}
        setValue={(depth) => {
          props.setStrategy(strategy.update(depth));
        }}
      />
    );
  } else if (Depth.isMaxDepthStrategy(props.strategy)) {
    const strategy = props.strategy;
    extraOptions = (
      <Slider
        info="The maximum number of times the triangles will be split"
        label="Depth"
        value={props.strategy.maxDepth}
        setValue={(maxDepth) => {
          props.setStrategy(strategy.update(maxDepth));
        }}
      />
    );
  }

  return (
    <VStack align={"left"}>
      <Select
        variant="filled"
        onChange={(strat) => {
          if (strat.target.value === Depth.Kind.Max) {
            props.setStrategy(
              new Depth.MaxDepthStrategy(
                Depth.Constraints.MaxDepth.mkMaxDepth(7)
              )
            );
          } else if (strat.target.value === Depth.Kind.Flip) {
            props.setStrategy(
              new Depth.FlipDepthStrategy(
                Depth.Constraints.FlipDepth.mkP(0.1),
                Depth.Constraints.FlipDepth.mkMaxDepth(7)
              )
            );
          } else if (strat.target.value === Depth.Kind.Inherited) {
            props.setStrategy(
              new Depth.InheritedDepthStrategy(
                Depth.Constraints.InheritedDepth.mkMinDepth(2)
              )
            );
          }
        }}
        value={props.strategy.kind}
      >
        <option value={Depth.Kind.Max}>{Depth.Kind.Max}</option>
        <option value={Depth.Kind.Flip}>{Depth.Kind.Flip}</option>
        <option value={Depth.Kind.Inherited}>{Depth.Kind.Inherited}</option>
      </Select>
      {extraOptions}
    </VStack>
  );
}

function DistanceStrat(props: {
  strategy: DistanceStrategy.Strategy.Type;
  setStrategy: (strat: DistanceStrategy.Strategy.Type) => void;
}) {
  const size = 200;
  return (
    <VStack align={"left"}>
      <Select
        variant="filled"
        onChange={(strat) => {
          props.setStrategy(
            DistanceStrategy.Kind.toStrategy(
              strat.target.value as DistanceStrategy.Kind.Type
            )
          );
        }}
        value={props.strategy.kind}
      >
        <option value={DistanceStrategy.Kind.XCentroid}>X-Axis</option>
        <option value={DistanceStrategy.Kind.YCentroid}>Y-Axis</option>
        <option value={DistanceStrategy.Kind.DistanceToPoint}>
          Distance To Point
        </option>
      </Select>
      {props.strategy.kind === "Dist to Point" ? (
        <CoordinateInput
          width={size}
          height={size}
          bgColor="blackAlpha.200"
          onPosition={(x: number, y: number) => {
            const copy = {
              ...props.strategy,
            } as DistanceStrategy.Strategy.DistanceToPoint;
            copy.x = copy.x.update(x / size);
            copy.y = copy.y.update(y / size);
            props.setStrategy(copy);
          }}
          x={(props.strategy.x.value * size) as number}
          y={(props.strategy.y.value * size) as number}
        />
      ) : (
        <></>
      )}
    </VStack>
  );
}

function CosinePalette(props: {
  palette: Palette.Cosine.Constraints.Palette;
  setPalette: (palette: Palette.Cosine.Constraints.Palette) => void;
}) {
  const colorPicker = (key: "red" | "green" | "blue") => {
    return (
      <>
        <Text fontSize="sm" whiteSpace={"nowrap"}>
          {key}
        </Text>
        <Slider
          info="The mean value of the cosinus wave"
          label="a"
          value={props.palette[key].a}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.Cosine.Constraints.Color;
            colorCopy.a = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.Cosine.Constraints.Palette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
        <Slider
          info="The amplitude of cosiuns wave"
          label="b"
          value={props.palette[key].b}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.Cosine.Constraints.Color;
            colorCopy.b = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.Cosine.Constraints.Palette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
        <Slider
          info="the frequency of the cosinus wave"
          label="c"
          value={props.palette[key].c}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.Cosine.Constraints.Color;
            colorCopy.c = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.Cosine.Constraints.Palette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
        <Slider
          info="the shift of the cosinus wave"
          label="d"
          value={props.palette[key].d}
          setValue={(v) => {
            const colorCopy = {
              ...props.palette[key],
            } as Palette.Cosine.Constraints.Color;
            colorCopy.d = v;

            const palleteCopy = {
              ...props.palette,
            } as Palette.Cosine.Constraints.Palette;
            palleteCopy[key] = colorCopy;
            props.setPalette(palleteCopy);
          }}
        />
      </>
    );
  };

  return (
    <VStack align={"left"}>
      {colorPicker("red")} {colorPicker("blue")} {colorPicker("green")}
      <Text fontSize="sm" whiteSpace={"nowrap"}>
        Mode
      </Text>
      <RadioGroup
        onChange={(newMode) => {
          const newSettings = {
            ...props.palette,
          } as Palette.Cosine.Constraints.Palette;
          newSettings.mode = newMode as Palette.Cosine.Mode;
          props.setPalette(newSettings);
        }}
        value={props.palette.mode}
      >
        <VStack direction="row" align={"left"}>
          <Radio value={"SMOOTH"}>Smooth</Radio>
          <Radio value={"MOD"}>Sharp</Radio>
        </VStack>
      </RadioGroup>
    </VStack>
  );
}
