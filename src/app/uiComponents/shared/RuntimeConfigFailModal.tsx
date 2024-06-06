import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';

export function RuntimeConfigFailModal() {
    return (
        <RuntimeErrorModal
            open={true}
            error={{
                message:
                    'Creatif configuration failed to update. This is definitely a bug. Try refreshing the page. If that doesn\'t help, try logging out and then loggin back in.',
            }}
        />
    );
}
