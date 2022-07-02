import { IconButton, IconButtonProps, useBoolean } from "@chakra-ui/react";

export type ToggleButtonProps = {
  on: React.ReactElement;
  off: React.ReactElement;
  value?: boolean;
  onChange?: (v: boolean) => void;
} & Omit<IconButtonProps, "value" | "onChange">;

export function ToggleButton({
  on,
  off,
  onClick,
  value,
  onChange,
  ...rest
}: ToggleButtonProps): JSX.Element {
  const [isOn, { toggle }] = useBoolean();

  const v = value !== undefined ? value : isOn;

  return (
    <IconButton
      {...rest}
      onClick={(v1) => {
        toggle();
        onChange && onChange(!v);
        onClick && onClick(v1);
      }}
    >
      {v ? on : off}
    </IconButton>
  );
}
