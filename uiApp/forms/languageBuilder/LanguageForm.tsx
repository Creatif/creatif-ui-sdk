import { InputText, Form, Grid, Cell, File } from '../../../src';
import css from '../realEstate/css/root.module.css';
import { Attachment } from '../../../src/types/forms/forms';

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
            inputs={(submitButton, {inputFile}) => (
                <>
                    <Grid gap="24px">
                        <Cell span="span 6">
                            <InputText
                                label="Language name"
                                name="name"
                                options={{
                                    required: 'Language name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 6">
                            <InputText
                                label="Language short name"
                                name="shortName"
                                options={{
                                    required: 'Language short name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 12">
                            <File label="Profile image" inputFile={inputFile} name="profileImage" fileButtonProps={{
                                accept: 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/avif'
                            }} />
                        </Cell>
                    </Grid>

                    <div className={css.submitButton}>{submitButton}</div>
                </>
            )}
        />
    );
}