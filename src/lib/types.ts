interface BatchParameter {
    name: string;
    type: 'node' | 'map' | 'list'
}

interface MutationArguments<T, K> {
    onError?: (error: unknown) => void;
    onSuccess?: (data: T, variables?: K) => void;
}
interface HttpErrorMetadata {
    key: string;
    message: string;
}
