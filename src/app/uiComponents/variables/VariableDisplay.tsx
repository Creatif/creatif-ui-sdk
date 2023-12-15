// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import ItemView from '@app/uiComponents/lists/list/ItemView';
import ActionSection from '@app/uiComponents/variables/ActionSection';
import InfoSection from '@app/uiComponents/variables/InfoSection';
import { useGetVariable } from '@lib/api/hooks/useGetVariable';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { CreatedVariable } from '@root/types/api/variable';
interface Props {
    variableName: string;
}
export default function VariableDisplay({ variableName }: Props) {
    const { isFetching, data } = useGetVariable<CreatedVariable>(variableName);

    console.log(data, isFetching);
    return (
        <>
            <ActionSection isLoading={isFetching} structureName={variableName} />
            <div className={contentContainerStyles.root}>
                {!isFetching && data && (
                    <>
                        <InfoSection
                            name={data.name}
                            behaviour={data.behaviour}
                            groups={data.groups}
                            shortId={data.shortID}
                            structureName={variableName}
                        />
                        <ItemView value={data.value} metadata={data.metadata} />
                    </>
                )}
            </div>
        </>
    );
}
