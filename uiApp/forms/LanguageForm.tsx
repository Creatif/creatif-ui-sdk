import { InputText } from '../../src/app/uiComponents/inputs/InputText';
import { Form } from '../../src/app/uiComponents/form/Form';
import { Image } from './Image';
import {Grid} from '../../src/app/layouts/Grid';
import { Cell } from '../../src/app/layouts/Cell';

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
                },
            }}
            inputs={(submitButton, { inputLocale, inputGroups, inputBehaviour, inputImage }) => (
                <>
                    <Grid gap="24px">
                        <Cell span="span 12">
                            <InputText
                                label="Language name"
                                name="name"
                                options={{
                                    required: 'Language name is required',
                                }}
                            />
                        </Cell>

                        <Cell>
                            <Image name='file1' inputImage={inputImage} />
                        </Cell>

                        <Cell>
                            <Image name='file2' inputImage={inputImage} />
                        </Cell>

                        <Cell>
                            <Image name='file3' inputImage={inputImage} />
                        </Cell>

                        <Cell>
                            <Image name='file4' inputImage={inputImage} />
                        </Cell>

                        <Cell>
                            <Image name='file5' inputImage={inputImage} />
                        </Cell>

                        <Cell>
                            <Image name='file6' inputImage={inputImage} />
                        </Cell>

                        <Cell span="span 12">{inputGroups()}</Cell>
                        <Cell span="span 12">{inputLocale()}</Cell>
                        <Cell span="span 12">{inputBehaviour()}</Cell>
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
