import { Select, VStack, Text } from "@chakra-ui/react";
import Folder from "src/Components/Folder";
import * as Settings from "./Settings";
import Slider from "src/Components/Slider";
import CoordinateInput from "src/Components/CoordinateInput";

type TuneTabProps = {
  settings: Settings.Settings;
  setSettings: (settings: Settings.Settings) => void;
};

export default function TuneTab(props: TuneTabProps): JSX.Element {
  const update = (fn: (settings: Settings.Settings) => void) => {
    const copy = { ...props.settings };
    fn(copy);
    props.setSettings(copy);
  };
  return (
    <VStack align={"left"}>
      <Folder label="Zoom" info="how zoomed you are">
        <Slider
          info="Zoom"
          label="Zoom"
          value={props.settings.zoom}
          setValue={(zoom) => {
            update((copy) => (copy.zoom = zoom));
          }}
        />
      </Folder>
      {/* Noise */}
      <Folder label="Noise" info="Determines the shape of the noise">
        <Slider
          info="The number of octaves that is used..."
          label="Octaves"
          value={props.settings.numOctaves}
          setValue={(numOctaves) => {
            update((copy) => (copy.numOctaves = numOctaves));
          }}
        />
        <Slider
          info="q.x"
          label="q.x"
          value={props.settings.q[0]}
          setValue={(qX) => {
            update((copy) => (copy.q = [qX, copy.q[1]]));
          }}
        />
        <Slider
          info="q.y"
          label="q.y"
          value={props.settings.q[1]}
          setValue={(qY) => {
            update((copy) => (copy.q = [copy.q[0], qY]));
          }}
        />
        <Slider
          info="r.x"
          label="r.x"
          value={props.settings.r[0]}
          setValue={(rX) => {
            update((copy) => (copy.r = [rX, copy.r[1]]));
          }}
        />
        <Slider
          info="r"
          label="r.y"
          value={props.settings.r[1]}
          setValue={(rY) => {
            update((copy) => (copy.r = [copy.q[0], rY]));
          }}
        />
        <Slider
          info="pattern"
          label="pattern"
          value={props.settings.pattern}
          setValue={(pattern) => {
            update((copy) => (copy.pattern = pattern));
          }}
        />
      </Folder>
      <Folder label="Strategies" info="Strategies">
        <VStack align={"left"}>
          <Select
            variant="filled"
            onChange={(strat) => {
              update(
                (copy) =>
                  (copy.interpolationStrategy = parseInt(
                    strat.target.value
                  ) as any)
              );
            }}
            value={props.settings.interpolationStrategy}
          >
            {Settings.Interpolation.all.map((n) => (
              <option value={n} key={n}>
                {Settings.Interpolation.toKind(n)}
              </option>
            ))}
          </Select>
          <Select
            variant="filled"
            onChange={(strat) => {
              update(
                (copy) =>
                  (copy.pixelDistanceStrategy = parseInt(
                    strat.target.value
                  ) as any)
              );
            }}
            value={props.settings.pixelDistanceStrategy}
          >
            {Settings.PixelDistance.all.map((n) => (
              <option value={n} key={n}>
                {Settings.PixelDistance.toKind(n)}
              </option>
            ))}
          </Select>

          {Settings.PixelDistance.hasCenterPoint(
            props.settings.pixelDistanceStrategy
          ) ? (
            <CoordinateInput
              width={"100%"}
              height={"200px"}
              bgColor="blackAlpha.200"
              onPosition={(x: number, y: number) => {
                update(
                  (copy) =>
                    (copy.centerPoint = [
                      copy.centerPoint[0].fromNumber(x),
                      copy.centerPoint[1].fromNumber(y),
                    ])
                );
              }}
              x={props.settings.centerPoint[0].value}
              y={props.settings.centerPoint[1].value}
            />
          ) : (
            <></>
          )}
        </VStack>
      </Folder>
      <Folder label="Color" info="Color">
        <PalletePicker
          name="Red"
          freq={props.settings.cosineC[0]}
          setFreq={(f) => {
            update((copy) => (copy.cosineC[0] = f));
          }}
          shift={props.settings.cosineD[0]}
          setShift={(d) => {
            update((copy) => (copy.cosineD[0] = d));
          }}
        />
        <PalletePicker
          name="Green"
          freq={props.settings.cosineC[1]}
          setFreq={(f) => {
            update((copy) => (copy.cosineC[1] = f));
          }}
          shift={props.settings.cosineD[1]}
          setShift={(d) => {
            update((copy) => (copy.cosineD[1] = d));
          }}
        />
        <PalletePicker
          name="Blue"
          freq={props.settings.cosineC[2]}
          setFreq={(f) => {
            update((copy) => (copy.cosineC[2] = f));
          }}
          shift={props.settings.cosineD[2]}
          setShift={(d) => {
            update((copy) => (copy.cosineD[2] = d));
          }}
        />
        <Text fontSize="sm" whiteSpace={"nowrap"}>
          Color Speed
        </Text>
        <Slider
          info="How fast the color changes"
          label="speed"
          value={props.settings.colorSpeed}
          setValue={(colorSpeed) =>
            update((copy) => (copy.colorSpeed = colorSpeed))
          }
        />
      </Folder>
    </VStack>
  );
}

function PalletePicker(props: {
  name: string;
  freq: Settings.Constraints.Cosine.CN;
  shift: Settings.Constraints.Cosine.CN;
  setFreq: (freq: Settings.Constraints.Cosine.CN) => void;
  setShift: (freq: Settings.Constraints.Cosine.CN) => void;
}) {
  return (
    <>
      <Text fontSize="sm" whiteSpace={"nowrap"}>
        {props.name}
      </Text>
      <Slider
        info="the frequency of the cosinus wave"
        label="freq"
        value={props.freq}
        setValue={props.setFreq}
      />
      <Slider
        info="the shift of the cosinus wave"
        label="shift"
        value={props.shift}
        setValue={props.setShift}
      />
    </>
  );
}
