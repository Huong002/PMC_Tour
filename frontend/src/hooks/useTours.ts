import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tourService } from '../services/tour.service';
import { CreateTourRequest, UpdateTourRequest } from '../types';

export const TOURS_KEY = ['tours'] as const;

export function useTourList(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...TOURS_KEY, params],
    queryFn: () => tourService.getAll(params),
    select: (res) => res.data,
  });
}

export function useTourDetail(id: number) {
  return useQuery({
    queryKey: [...TOURS_KEY, id],
    queryFn: () => tourService.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTourRequest) => tourService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TOURS_KEY }),
  });
}

export function useUpdateTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTourRequest }) =>
      tourService.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: TOURS_KEY });
      qc.invalidateQueries({ queryKey: [...TOURS_KEY, variables.id] });
    },
  });
}

export function useDeleteTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tourService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TOURS_KEY }),
  });
}
