# UI components

Creatif ships with ready made UI components that you can use right away but there is
nothing stopping you to create your own components.

In the tutorial, we created the `RichTextEditor` components. This is how it looked like

```tsx
import { useEffect, useRef, useTransition } from 'react';
import Quill from 'quill';
import type { QuillOptions } from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import type { Delta } from 'quill/core';
import { useCreatifFormContext, useCreatifController } from 'creatif-ui-sdk';

interface Props {
    name: string;
    placeholder?: string;
}

export function RichTextEditor({ name, placeholder }: Props) {
    const { control, setValue, getValues } = useCreatifFormContext();
    const containerRef = useRef();
    const deltaRef = useRef<typeof Delta>(Quill.import('delta'));
    const quillRef = useRef<Quill>(null);
    const [_, setTransition] = useTransition();

    const { field } = useCreatifController({
        name,
        control,
    });

    useEffect(() => {
        if (containerRef.current) {
            const options: QuillOptions = {
                debug: 'error',
                modules: {
                    toolbar: true,
                },
                placeholder: placeholder,
                theme: 'snow',
            };

            const quill = new Quill(containerRef.current, options);
            quillRef.current = quill;

            const defaultValue = getValues(name);
            if (defaultValue) {
                const delta = new deltaRef.current(defaultValue);
                quillRef.current.setContents(delta);
                setValue(name, delta);
            }

            quill.on('text-change', (delta) => {
                setTransition(() => {
                    field.onChange(delta);
                    setValue(name, quillRef.current.getContents());
                });
            });
        }
    }, []);

    return (
        <div>
            <label
                style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                }}>
                Account note
            </label>
            <div ref={containerRef} />
        </div>
    );
}
```

As you can see, there is nothing Creatif specific about this component. A component can also
be a simple input field without any styles applied to it

```tsx
interface Props {
    name: string;
}

export function Input({ name }: Props) {
    return <input name={name} />;
}
```

Creatif uses and relies on `react-hook-form`. If you have a complicated component that you want
to make it work with Creatif, you can see the guide in [react-hook-form documentation](https://react-hook-form.com/docs/usecontroller/controller).

Components exported from Creatif use [Mantine](https://mantine.dev/). Every component is an
abstraction around components from Mantine. All the field options that Mantine provides can
be used with any exported Creatif component.

Some (not all) components are provided as controlled and uncontrolled where possible. For example,
`InputPinControlled` component is a component with which you can create a one time pin
for authentication, for example. It is not possible to make it an uncontrolled component.
If the component is controlled, it will have `Controlled` suffix in the component name.

The main difference between controlled and uncontrolled components is that controlled components
allow you to use `onInputChange()` function prop with which you can listen for input change.
Note that it might be better and maintainable to use [watch](https://react-hook-form.com/docs/useform/watch)
or [useWatch](https://react-hook-form.com/docs/usewatch) provided by `react-hook-form`.

> IMPORTANT
>
> Registering an `onChange` event on a controlled component will raise an error
> since an `onChange` event is already registered. Use `onInputChange()` prop to subscribe
> to changes from `onChange` event.

The following is a list of all components that you can use that are exported from Creatif.

# InputText

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends TextInputProps {
    name: string;
    options?: RegisterOptions;
}
```

`InputText` is an abstraction around [TextInput](https://mantine.dev/core/text-input/) Mantine component.
Any props that it uses, you can use with `InputText`.

# InputTextControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends TextInputProps {
    name: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (value: string) => void;
}
```

`InputTextControlled` is an abstraction around [TextInput](https://mantine.dev/core/text-input/) Mantine component.
Any props that it uses, you can use with `InputTextControlled`.

# InputTextarea

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends TextareaProps {
    name: string;
    options?: RegisterOptions;
}
```

`InputTextarea` is an abstraction around [Textarea](https://mantine.dev/core/textarea/) Mantine component.
Any props that it uses, you can use with `InputTextarea`.

# InputTextareaControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends TextareaProps {
    name: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (value: string) => void;
}
```

`InputTextareaControlled` is an abstraction around [Textarea](https://mantine.dev/core/textarea/) Mantine component.
Any props that it uses, you can use with `InputTextareaControlled`.

# InputCheckbox

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends CheckboxProps {
    name: string;
    options?: RegisterOptions;
}
```

`InputCheckbox` is an abstraction around [Checkbox](https://mantine.dev/core/checkbox/) Mantine component.
Any props that it uses, you can use with `InputCheckbox`.

# InputCheckboxControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends CheckboxProps {
    name: string;
    options?: RegisterOptions;
    onInputChange?: (value: boolean) => void;
}
```

`InputCheckboxControlled` is an abstraction around [Checkbox](https://mantine.dev/core/checkbox/) Mantine component.
Any props that it uses, you can use with `InputCheckboxControlled`.

# InputRadio

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends RadioProps {
    name: string;
    options?: RegisterOptions;
}
```

`InputRadio` is an abstraction around [Radio](https://mantine.dev/core/radio/) Mantine component.
Any props that it uses, you can use with `InputRadio`.

# InputRadioControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends RadioProps {
    name: string;
    options?: RegisterOptions;
    onInputChange?: (value: boolean) => void;
}
```

`InputRadioControlled` is an abstraction around [Radio](https://mantine.dev/core/radio/) Mantine component.
Any props that it uses, you can use with `InputRadioControlled`.

# InputNumberControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends NumberInputProps {
    name: string;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (checked: string | number) => void;
}
```

`InputNumber` is an abstraction around [NumberInput](https://mantine.dev/core/number-input/) Mantine component.
Any props that it uses, you can use with `InputNumber`.

# InputEmail

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends TextInputProps {
    name: string;
    options?: RegisterOptions;
}
```

`InputEmail` is an abstraction around `InputText` provided by Creatif. It provides a basic
pattern matching to validate an email. This is the regex:

```regexp
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

If you would like to use some other regex, provide a `pattern` option and it will use it.

```tsx
<InputEmail name="email" options={{
    pattern: {
        value: /my-pattern/,
        message: 'Value is invalid'
    }
}}
```

# InputEmailControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends TextInputProps {
    name: string;
    options?: RegisterOptions;
    onInputChange?: (value: string) => void;
}
```

`InputEmailControlled` is an abstraction around `InputText` provided by Creatif. It provides a basic
pattern matching to validate an email. This is the regex:

```regexp
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

If you would like to use some other regex, provide a `pattern` option and it will use it.

```tsx
<InputEmail name="email" options={{
    pattern: {
        value: /my-pattern/,
        message: 'Value is invalid'
    }
}}
```

# InputDateControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends DateInputProps {
    name: string;
    format?: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (date: string) => void;
}
```

`InputDateControlled` is an abstraction around [Mantine date component](https://mantine.dev/dates/getting-started/). It is
only an implementation of what is possible with this Mantine component and might not have all the features you want.
For fine-grained features, create a component of your choice.

This component is an abstraction around [DateInput](https://mantine.dev/dates/date-input/) and accepts
all props that this component accepts.

# InputChipControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends ChipProps {
    name: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (checked: boolean) => void;
}
```

`InputChipControlled` is an abstraction around [Chip](https://mantine.dev/core/chip/) Mantine component.
Any props that it uses, you can use with `InputChipControlled`.

# InputPinControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends PinInputProps {
    name: string;
    onInputChange?: (value: string) => void;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
```

`InputPinControlled` is an abstraction around [PinInput](https://mantine.dev/core/pin-input/) Mantine component.
Any props that it uses, you can use with `InputPinControlled`.

# InputRangeSliderControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends RangeSliderProps {
    name: string;
    onInputChange?: (value: [number, number]) => void;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
```

`InputRangeSliderControlled` is an abstraction around [RangeSlider](https://mantine.dev/core/slider/) Mantine component.
Any props that it uses, you can use with `InputRangeSliderControlled`.

# InputSliderControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends SliderProps {
    name: string;
    onInputChange?: (value: number) => void;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
```

`InputSliderControlled` is an abstraction around [Slider](https://mantine.dev/core/slider/) Mantine component.
Any props that it uses, you can use with `InputSliderControlled`.

# InputRatingControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends RatingProps {
    name: string;
    onInputChange?: (value: number) => void;
}
```

`InputRatingControlled` is an abstraction around [Rating](https://mantine.dev/core/rating/) Mantine component.
Any props that it uses, you can use with `InputRatingControlled`.

# InputSegmentedControlControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends SegmentedControlProps {
    name: string;
    onInputChange?: (value: string) => void;
    data: string[] | SegmentedControlItem[];
}

export interface SegmentedControlItem {
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
}
```

`InputSegmentedControlControlled` is an abstraction around [Rating](https://mantine.dev/core/segmented-control/) Mantine component.
Any props that it uses, you can use with `InputSegmentedControlControlled`.

# InputSelectControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends SelectProps {
    name: string;
    data: string[] | { value: string; label: string }[];
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
```

`InputSelectControlled` is an abstraction around [Select](https://mantine.dev/core/select/) Mantine component.
Any props that it uses, you can use with `InputSelectControlled`.

`Select` input was created with [Mantine Combobox](https://mantine.dev/core/combobox/) which is
very powerful. If you need additional functionality, use can create one yourself with it.

# InputSwitch

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends SwitchProps {
    name: string;
    options?: RegisterOptions;
}
```

`InputSwitch` is an abstraction around [Switch](https://mantine.dev/core/switch/) Mantine component.
Any props that it uses, you can use with `InputSwitch`.

# InputSwitchControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

```ts
interface Props extends SwitchProps {
    name: string;
    onInputChange?: (value: boolean) => void;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    options?: RegisterOptions;
}
```

`InputSwitchControlled` is an abstraction around [Switch](https://mantine.dev/core/switch/) Mantine component.
Any props that it uses, you can use with `InputSwitchControlled`.

# Special Creatif components

Creatif injects its features trough special function components. Those are `inputConnection`, `inputLocale` and
`inputGroups`. Find out more about locales in a [dedicated section](locales) and about [groups](using-groups)

````tsx
import { Form } from 'creatif-ui-sdk';

export function MyForm() {
    return (
        <Form>
            inputs={(submitButton, {inputConnection, inputLocale, inputGroups }) => {
                return (
                    <>
                        {inputConnection({
                            structureName: 'Accounts',
                            name: 'accounts',
                            structureType: 'map',
                            label: 'Account',
                            options: {
                                required: 'Selecting an account is required',
                            },
                        })}

                        {inputLocale()}

                        {inputGroups()}
                    </>
                );
            }}
        />
    );
}

````

# inputConnection()

`inputReference()` allows you to make a connection between two structure entries. It accepts
the following interface

```ts
interface ReferenceInputProps {
    name: string;
    structureName: string;
    structureType: StructureType;
    label?: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}

type StructureType = 'list' | 'map';
```

This function renders a dropdown component with which you can choose a structure entry to connect.

> IMPORTANT
> 
> For now, this component does not work with `useArrayFields()` function from `react-hook-form`.

It accepts the same options from `react-hook-form` as any other dropdown. 

# inputLocale()

This function renders a dropdown of all available locales. It accepts the following interface:

````ts
interface LocaleWrapperProps {
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
````

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

You can find out more about locales in a [dedicated section](locales). 

# inputGroups()

This function renders a dropdown with all groups that are created. Selected groups are highlighted with a checkmark.
It accepts the following interface:

````ts
interface GroupsWrapperProps {
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
````

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

You can find out more about groups in a [dedicated section](using-groups)


 
