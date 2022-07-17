import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useStoreInUrl<A>(
  encode: (v: A) => string,
  decode: (s: string) => Promise<A>,
  init: (() => A) | A
): [A, React.Dispatch<React.SetStateAction<A>>] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(init);

  useEffect(() => {
    const run = async () => {
      const configBase64 = searchParams.get("data");
      if (configBase64) {
        const config = await decode(configBase64);
        // TODO: add a typecheck here!
        if (config) {
          setValue(config);
        }
      }
    };
    run();
  }, []);

  useEffect(() => {
    const encoding = encode(value);
    setSearchParams({
      v: "1",
      data: encoding,
    });
  }, [value]);

  return [value, setValue];
}
