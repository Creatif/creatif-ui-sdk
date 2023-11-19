interface Props {
    isLoading: boolean;
}
export default function Loading({isLoading}: Props) {
	if (!isLoading) return null;

	return <div className="center">
		<i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
	</div>;
}