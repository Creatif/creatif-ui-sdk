import { InputText, Form, Grid, Cell } from '../../../src';
import css from '../realEstate/css/root.module.css';

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
            inputs={(submitButton, {inputConnection}) => (
                <>
                    <Grid gap="24px">
                        <Cell span="span 6">
                            <InputText
                                label="Deck name"
                                name="name"
                                options={{
                                    required: 'Deck name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 6">
                            {inputConnection({
                                name: 'language',
                                structureName: 'Languages',
                                structureType: 'map',
                            })}
                        </Cell>
                    </Grid>

                    <div className={css.submitButton}>{submitButton}</div>
                </>
            )}
        />
    );
}