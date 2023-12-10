import type { CacheResult } from '@root/types/app';

const cache: Record<string, unknown> = {};
export function useCache() {
	return function <T>(
		key: string,
		fn: () => Promise<T>,
		callback: (value: CacheResult<T> | undefined, error: Error | undefined) => void,
	) {
		if (!Object.hasOwn(cache, key)) {
			fn()
				.then((value) => {
					cache[key] = value;

					callback(
						{
							hit: false,
							value: cache[key] as T,
						},
						undefined,
					);
				})
				.catch((e) => {
					callback(undefined, e);
				});

			return;
		}

		callback(
			{
				hit: false,
				value: cache[key] as T,
			},
			undefined,
		);
	};
}
