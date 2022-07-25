import * as Algorithm from "./Algorithm";
import { TuneTab } from "./TuneTab";
import AboutTab from "./AboutTab";
import AdaptiveSketch from "src/Components/AdaptiveSketch";
import GenerativeStudio from "src/Components/GenerativeStudio";
import p5 from "p5";
import { useStoreInUrl } from "src/Hooks/useStoreInUrl";

const randomSetting = () =>
  Algorithm.generateSettings(Algorithm.generateSeed());

export default function StainedGlass() {
  const [settings, setSettings] = useStoreInUrl(
    Algorithm.encode,
    Algorithm.decode,
    randomSetting
  );

  return (
    <GenerativeStudio
      onDownload={(width, height, name, format) => {
        Algorithm.download(
          width,
          height,
          settings,
          name,
          format,
          new p5(() => {})
        );
      }}
      onGenerateRandomClick={() => setSettings(randomSetting())}
      name="Stained Glass"
      tuneTab={<TuneTab setSettings={setSettings} settings={settings} />}
      aboutTab={<AboutTab />}
    >
      <AdaptiveSketch
        setup={Algorithm.setup}
        draw={(w, h) => Algorithm.draw()(settings, w, h)} // TODO: fix memoization
      />
    </GenerativeStudio>
  );
}
