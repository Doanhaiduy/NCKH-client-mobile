import { QueryFunction, QueryKey, QueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useApiGet = (key: QueryKey, fn: QueryFunction<unknown, QueryKey, never>, options: QueryOptions) =>
    useQuery({
        queryKey: key,
        queryFn: fn,
        ...options,
    });

export const useApiSend = (fn: any, success: any, error: any, invalidateKey: any, options: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fn,

        onSuccess: (data) => {
            invalidateKey && invalidateKey.forEach((key: any) => queryClient.invalidateQueries(key));
            success && success(data);
        },
        onError: error,
        retry: 2,
        ...options,
    });
};
