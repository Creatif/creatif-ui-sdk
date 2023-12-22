import { DataTable } from 'mantine-datatable';
import type { PaginationResult } from '@root/types/api/list';
interface Props<Value, Metadata> {
    data: PaginationResult<Value, Metadata>;
}
function resolveColumns(values: never) {
    const columnKeys = Object.keys(values);
    const columns = [];
    for (const colKey of columnKeys) {
        columns.push({
            accessor: colKey,
            sortable: false,
        });
    }

    return columns;
}
export default function MainTableView<Value, Metadata>({ data }: Props<Value, Metadata>) {
    if (!data.data) {
        return <p>Nothing found</p>;
    }

    return (
        <div
            style={{
                maxWidth: '1280px',
            }}>
            <DataTable
                withTableBorder
                highlightOnHover
                striped
                borderRadius="sm"
                withColumnBorders
                columns={resolveColumns(data.data[0].value)}
                records={data.data.map((item) => ({
                    ...item.value,
                    id: item.id,
                }))}
            />
        </div>
    );
}
