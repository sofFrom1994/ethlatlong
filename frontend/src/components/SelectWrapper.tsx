import type { SelectProps, ValidationResult } from "react-aria-components";
import {
  Button,
  Label,
  ListBox,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

interface SelectWrapperProps<T extends object>
  extends Omit<SelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function SelectWrapper<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectWrapperProps<T>) {
  return (
    <Select>
      <Label>Choose a Layer</Label>
      <Button>
        <SelectValue tabIndex={0}>
          {({ defaultChildren, isPlaceholder }) => {
            return isPlaceholder ? (
              <>
                <b>Layer</b> selection
              </>
            ) : (
              defaultChildren
            );
          }}
        </SelectValue>
        <span aria-hidden="true">▼</span>
      </Button>
      <Popover style={{ zIndex: 2147483647 }}>
        <ListBox>{children}</ListBox>
      </Popover>
    </Select>
  );
}
