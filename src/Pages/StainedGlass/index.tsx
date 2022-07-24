import React, { useEffect } from "react";
import * as Algorithm from "./Algorithm";
import { useSearchParams } from "react-router-dom";
import { TuneTab } from "./TuneTab";
import AboutTab from "./AboutTab";
import AdaptiveSketch from "src/Components/AdaptiveSketch";
import GenerativeStudio from "src/Components/GenerativeStudio";
import p5 from "p5";

export default function StainedGlass() {
  const [settings, setSettings] = React.useState(() =>
    Algorithm.generateSettings(Algorithm.generateSeed())
  );

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const configBase64 = searchParams.get("data");
      if (configBase64) {
        const config = await Algorithm.decode(configBase64);
        // TODO: add a typecheck here!
        if (config) {
          setSettings(config);
        }
      }
    };
    run();
  }, []);

  useEffect(() => {
    const encoding = Algorithm.encode(settings);
    setSearchParams({
      v: "1",
      data: encoding,
    });
  }, [settings]);

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
      onGenerateRandomClick={() =>
        setSettings(Algorithm.generateSettings(Algorithm.generateSeed()))
      }
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
