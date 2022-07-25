import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useStoreInUrl<A>(
  encode: (v: A) => string,
  decode: (s: string) => Promise<A>,
  init: (() => A) | A
): [A, (value: A) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(init);

  useEffect(() => {
    const run = async () => {
      const configBase64 = searchParams.get("data");
      if (configBase64) {
        try {
          const config = await decode(configBase64);
          // TODO: add a typecheck here!
          if (config) {
            setValue(config);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    run();

    window.addEventListener("popstate", run);
    return () => {
      window.removeEventListener("popstate", run);
    };
  }, [searchParams]);

  return [
    value,
    (newValue) => {
      setValue(newValue);
      const encoding = encode(newValue);
      setSearchParams(
        {
          v: "1",
          data: encoding,
        },
        { replace: false }
      );
    },
  ];
}
