interface Props {
    Component: any;
    structureName: string;
}
export default function RouterComponent({Component, structureName}: Props) {
	return <Component structureName={structureName} />;
}