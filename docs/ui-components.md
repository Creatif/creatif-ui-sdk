# UI components

Creatif ships with ready made UI components that you can use right away but there is
nothing stopping you to create your own components. 

In the tutorial, we created the `RichTextEditor` components. This is how it looked like

````tsx
import {useEffect, useRef, useTransition} from 'react';
import Quill from 'quill';
import type {QuillOptions} from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import type { Delta } from 'quill/core';
import {useCreatifFormContext, useCreatifController} from "creatif-ui-sdk";

interface Props {
    name: string;
    placeholder?: string;
}

export function RichTextEditor({name, placeholder}: Props) {
    const {control, setValue, getValues} = useCreatifFormContext();
    const containerRef = useRef();
    const deltaRef = useRef<typeof Delta>(Quill.import('delta'));
    const quillRef = useRef<Quill>(null);
    const [_, setTransition] = useTransition();

    const {
        field,
    } = useCreatifController({
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
                theme: 'snow'
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

    return <div>
        <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
        }}>Account note</label>
        <div ref={containerRef} />
    </div>;
}
````
As you can see, there is nothing Creatif specific about this component. A component can also
be a simple input field without any styles applied to it

````tsx
interface Props {
    name: string;
}

export function Input({name}: Props) {
    return <input name={name} />
}
````

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

````ts
interface Props extends TextInputProps {
    name: string;
    options?: RegisterOptions;
}
````

`InputText` is an abstraction around [TextInput](https://mantine.dev/core/text-input/) Mantine component. 
Any props that it uses, you can use with `InputText`.

# InputTextControlled

`RegisterOptions` type is provided by [react-hook-form](https://react-hook-form.com/ts#RegisterOptions)

````ts
interface Props extends TextInputProps {
    name: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (value: string) => void;
}
````

`InputTextControlled` is an abstraction around [TextInput](https://mantine.dev/core/text-input/) Mantine component.
Any props that it uses, you can use with `InputTextControlled`.



