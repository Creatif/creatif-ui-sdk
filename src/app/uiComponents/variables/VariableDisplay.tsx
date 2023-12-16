// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import ItemView from '@app/uiComponents/lists/list/ItemView';
import NothingFound from '@app/uiComponents/lists/list/NothingFound';
import ActionSection from '@app/uiComponents/variables/ActionSection';
import InfoSection from '@app/uiComponents/variables/InfoSection';
import { useGetVariable } from '@lib/api/hooks/useGetVariable';
interface Props {
    variableName: string;
}
export default function VariableDisplay({ variableName }: Props) {
    const { isFetching, data, error } = useGetVariable(variableName);

    return (
        <>
            <ActionSection isLoading={isFetching} structureName={variableName} />
            <div className={contentContainerStyles.root}>
                {!isFetching && error && <NothingFound structureName={variableName} />}
                {!isFetching && data?.result && !error && (
                    <>
                        <InfoSection
                            name={data.result.name}
                            behaviour={data.result.behaviour}
                            groups={data.result.groups}
                            shortId={data.result.shortID}
                            structureName={variableName}
                        />
                        <ItemView value={data.result.value} metadata={data.result.metadata} />
                    </>
                )}
            </div>
        </>
    );
}
