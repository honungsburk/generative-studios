import { Select, VStack } from "@chakra-ui/react";
import Folder from "src/Components/Folder";
import * as Settings from "./Settings";
import Slider from "src/Components/Slider";
import * as Util from "src/Util";
import CoordinateInput from "src/Components/CoordinateInput";

type TuneTabProps = {
  settings: Settings.Settings;
  setSettings: (settings: Settings.Settings) => void;
};

export default function TuneTab(props: TuneTabProps): JSX.Element {
  return (
    <VStack align={"left"}>
      <Folder label="Zoom" info="how zoomed you are">
        <Slider
          info="Zoom"
          label="Zoom"
          value={props.settings.zoom}
          setValue={(zoom) => {
            const copy = {
              ...props.settings,
            };
            copy.zoom = zoom;
            props.setSettings(copy);
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
            const copy = {
              ...props.settings,
            };
            copy.numOctaves = numOctaves;
            props.setSettings(copy);
          }}
        />
        <Slider
          info="q.x"
          label="q.x"
          value={props.settings.q[0]}
          setValue={(qX) => {
            const copy = {
              ...props.settings,
            };
            copy.q = [qX, copy.q[1]];
            props.setSettings(copy);
          }}
        />
        <Slider
          info="q.y"
          label="q.y"
          value={props.settings.q[1]}
          setValue={(qY) => {
            const copy = {
              ...props.settings,
            };
            copy.q = [copy.q[0], qY];
            props.setSettings(copy);
          }}
        />
        <Slider
          info="r.x"
          label="r.x"
          value={props.settings.r[0]}
          setValue={(rX) => {
            const copy = {
              ...props.settings,
            };
            copy.r = [rX, copy.r[1]];
            props.setSettings(copy);
          }}
        />
        <Slider
          info="r"
          label="r.y"
          value={props.settings.r[1]}
          setValue={(rY) => {
            const copy = {
              ...props.settings,
            };
            copy.r = [copy.q[0], rY];
            props.setSettings(copy);
          }}
        />
        <Slider
          info="pattern"
          label="pattern"
          value={props.settings.pattern}
          setValue={(pattern) => {
            const copy = {
              ...props.settings,
            };
            copy.pattern = pattern;
            props.setSettings(copy);
          }}
        />
      </Folder>
      <Folder label="Color" info="How to color the noise">
        <VStack align={"left"}>
          <Select
            variant="filled"
            onChange={(strat) => {
              const copy = {
                ...props.settings,
              };
              copy.interpolationStrategy = parseInt(strat.target.value) as any;
              props.setSettings(copy);
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
              const copy = {
                ...props.settings,
              };
              copy.pixelDistanceStrategy = parseInt(strat.target.value) as any;
              props.setSettings(copy);
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
                const copy = {
                  ...props.settings,
                };
                copy.centerPoint = [
                  copy.centerPoint[0].fromNumber(x),
                  copy.centerPoint[1].fromNumber(y),
                ];
                props.setSettings(copy);
              }}
              x={props.settings.centerPoint[0].value}
              y={props.settings.centerPoint[1].value}
            />
          ) : (
            <></>
          )}
        </VStack>
      </Folder>
    </VStack>
  );
}
