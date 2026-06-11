import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export const AUTH_USER_KEY = ['authUser'] as const;

export function useAuth() {
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: () => authService.getProfile(),
    select: (res) => res.data,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.token);
      qc.setQueryData(AUTH_USER_KEY, data.data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.token);
      qc.setQueryData(AUTH_USER_KEY, data.data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      qc.setQueryData(AUTH_USER_KEY, null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });

  return {
    user: profileQuery.data,
    isLoading: profileQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
  };
}
