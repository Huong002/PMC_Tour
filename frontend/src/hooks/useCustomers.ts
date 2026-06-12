import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import { UserCreateDto, UserUpdateDto } from '../types';

export const CUSTOMERS_KEY = ['customers'] as const;

export function useCustomerList(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, params],
    queryFn: () => customerService.getAll(params),
    select: (res) => res.data,
  });
}

export function useCustomerDetail(id: number) {
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, id],
    queryFn: () => customerService.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCreateDto) => customerService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateDto }) =>
      customerService.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      qc.invalidateQueries({ queryKey: [...CUSTOMERS_KEY, variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customerService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}
