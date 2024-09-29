# Uploading files

Lets dig right into the code

```typescript jsx
import { InputText, Form, Grid, Cell, File } from 'creatif';

export default function LanguageForm() {
    return (
        <Form<{
            name: string;
        }>
            bindings={{
                name: (values) => values.name,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    shortName: '',
                },
            }}
            inputs={(submitButton, { inputFile }) => (
                <>
                    <Grid gap="24px">
                        <Cell span="span 6">
                            <InputText
                                label="Image name"
                                name="name"
                                options={{
                                    required: 'Image name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 12">
                            <File
                                label="Profile image"
                                inputFile={inputFile}
                                name="profileImage"
                                fileButtonProps={{
                                    accept: 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/avif',
                                }}
                            />
                        </Cell>
                    </Grid>

                    <div className={css.submitButton}>{submitButton}</div>
                </>
            )}
        />
    );
}
```

This form has two fields. An image name and the image to upload. This form will look something like this:

![Uploading images example](_images/uploading_image_form.png 'Example of uploading image form')

Nothing too complicated.

The first thing to notice is this part of the code:

```javascript
inputs={(submitButton, {inputFile}) => (
```

`inputFile()` function is the function with which we upload a file or multiple files. For now, let's keep it aside because
this function is a low level function that you will use only if you need fine-grained configuration of your file upload.
To make it less complicated, the `File` component is here. It accepts these properties:

```typescript
interface Props {
    inputFile: (props: InputFileFieldProps) => React.ReactNode;
    name: string;
    label?: string;
    description?: string;
    fileButtonProps?: FileButtonProps;
    buttonProps?: ButtonProps;
    validation?: {
        allowedSize?: {
            size: number;
            message?: string;
        };
        allowedDimensions?: {
            width: number;
            height: number;
            message?: string;
        };
        required?: {
            value: boolean;
            message?: string;
        };
        maxFiles?: number;
    };
}
```

The first one is the `inputFile()` function that we talked about. The others are regular form field properties like
`name` and label.

The most important of the is the `fileButtonProps`. This is a proxy to actual file button properties and it accepts
the same properties as the `<input type="file"` does, like `multiple` or `accepts`. For example, if you want to upload
multiple files, add the `multiple` property to the `File` component.

```typescript jsx
<File
    label="Profile image"
    inputFile={inputFile}
    name="profileImage"
    fileButtonProps={{
        accept: 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/avif',
        multiple: true,
    }}
/>
```

If you do that and upload multiple files, it might look something like this:

![Uploading multiple files](_images/uploading_files_multiple_images.png 'Uploading multiple files')

That is it. There is nothing too complicated about the `File` component. It is very easy to use and I would recommend that
you use it before trying anything custom. It gives a nice UI out of the box and works well with other components of the UI.
