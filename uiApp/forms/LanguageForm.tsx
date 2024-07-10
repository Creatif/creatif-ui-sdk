import { InputText } from '../../src/app/uiComponents/inputs/InputText';
import { Form } from '../../src/app/uiComponents/form/Form';
import { Image } from './Image';
import {Grid} from '../../src/app/layouts/Grid';
import { Cell } from '../../src/app/layouts/Cell';
import { AddImages } from './AddImages';
import { File } from '../../src/app/uiComponents/inputs/fileUpload/File';

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
            inputs={(submitButton, { inputLocale, inputGroups, inputBehaviour, inputFile }) => (
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

                        <Cell span="span 12">
                            <File fileButtonProps={{
                                multiple: true,
                            }} label="File 1 upload" description="this is a description of file other upload stuff sdlkfjsak f dfčld f jsdf jsjf sk jfsačlf jčlsa fsa jfčsaj fčsaj fčlsak jfčlsa jfs fdčlsa jfsakj fsa jfčlsa jfčlsaj fčsajf sačlf jčlsa f" name="file1" inputFile={inputFile} />
                        </Cell>

                        <Cell span="span 12">
                            <File label="file 2 upload" description="This is a description of file 1 upload" name="file2" inputFile={inputFile} />
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
