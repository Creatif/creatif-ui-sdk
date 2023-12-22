import FormGrid from '@app/components/grid/FormGrid';
import GridCell from '@app/components/grid/GridCell';
import InputSwitch from '@app/uiComponents/inputs/InputSwitch';
import InputText from '@app/uiComponents/inputs/InputText';
import VariableForm from '@app/uiComponents/variableForm/VariableForm';
import InputLocale from '@app/uiComponents/inputs/InputLocale';

interface Props {
    variableName: string;
    mode?: 'update';
}
export default function LandingPageBanner({ variableName, mode }: Props) {
    return (
        <VariableForm<{ title: string; enabled: boolean; locale: string }>
            variableName={variableName}
            mode={mode}
            formProps={{
                defaultValues: {
                    title: '',
                    enabled: false,
                    locale: '',
                },
            }}
            inputs={(submitButton, { inputLocale }) => (
                <>
                    <InputText
                        options={{
                            required: 'Title is required',
                        }}
                        label="Title"
                        name="title"
                    />

                    {inputLocale()}

                    <InputSwitch
                        description="Will this banner appear on the landing page or not?"
                        label="Enabled"
                        name="enabled"
                    />

                    {submitButton}
                </>
            )}
        />
    );
}
