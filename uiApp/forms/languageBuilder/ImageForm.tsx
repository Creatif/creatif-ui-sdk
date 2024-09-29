import { InputText, Form, Grid, Cell, File } from '../../../src';

export default function ImageForm() {
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
            inputs={(submitButton, {inputFile}) => (
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
                            <File label="Profile image" inputFile={inputFile} name="profileImage" fileButtonProps={{
                                accept: 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/avif',
                                multiple: true,
                            }} />
                        </Cell>
                    </Grid>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '3rem',
                    }}>{submitButton}</div>
                </>
            )}
        />
    );
}