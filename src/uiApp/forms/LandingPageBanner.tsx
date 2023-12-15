import FormGrid from '@app/components/grid/FormGrid';
import GridCell from '@app/components/grid/GridCell';
import InputSwitch from '@app/uiComponents/inputs/InputSwitch';
import InputText from '@app/uiComponents/inputs/InputText';
import VariableForm from '@app/uiComponents/variableForm/VariableForm';

interface Props {
    variableName: string;
    mode?: 'update';
}
export default function LandingPageBanner({ variableName, mode }: Props) {
    return (
        <VariableForm<{ title: string; enabled: boolean }>
            variableName={variableName}
            mode={mode}
            formProps={{
                defaultValues: {
                    title: '',
                    enabled: false,
                },
            }}
            inputs={(submitButton) => (
                <>
                    <FormGrid>
                        <GridCell>
                            <InputText
                                options={{
                                    required: 'Title is required',
                                }}
                                label="Title"
                                name="title"
                            />
                            <InputSwitch
                                description="Will this banner appear on the landing page or not?"
                                label="Enabled"
                                name="enabled"
                            />
                        </GridCell>
                    </FormGrid>

                    {submitButton}
                </>
            )}
        />
    );
}
