import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useInvalidatingMutation<TData, TVars = void>({
  mutationFn,
  invalidate,
}: {
  mutationFn: (variables: TVars) => Promise<TData>
  invalidate: readonly (readonly unknown[])[]
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      for (const queryKey of invalidate) queryClient.invalidateQueries({ queryKey })
    },
  })
}
