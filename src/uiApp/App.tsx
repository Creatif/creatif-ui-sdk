import ListForm from '@app/uiComponents/listForm/ListForm';
import { CreatifProvider } from '@root/CreatifProvider';
export default function App() {
	return (
		<CreatifProvider apiKey="$2a$10$d6TFNYgEII0CmPHAWz0IRux5eYeM5tMtk8cAH70MpMVYwmr1QDPGG" projectId="01HFMBG48P99N4T10A4MF357GW">
			<ListForm listName="firstList" defaultValues={{
				title: '',
				description: '',
				content: '',
			}} />
		</CreatifProvider>
	);
}
