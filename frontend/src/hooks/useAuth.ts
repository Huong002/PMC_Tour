import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export const AUTH_USER_KEY = ['authUser'] as const;

type AuthUser = {
  userId: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: string;
  roles: string[];
};

export function useAuth() {
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: async () => {
      const res = await authService.getProfile();
      return res.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { token, refreshToken, userId, username, fullName, roles } = data.data;
      localStorage.setItem('accessToken', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      const user: AuthUser = { userId, username, fullName, roles, role: roles[0] || 'Customer' };
      qc.setQueryData(AUTH_USER_KEY, user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      const { token, refreshToken, userId, username, fullName, roles } = data.data;
      localStorage.setItem('accessToken', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      const user: AuthUser = { userId, username, fullName, roles, role: roles[0] || 'Customer' };
      qc.setQueryData(AUTH_USER_KEY, user);
    },
  });

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    qc.setQueryData(AUTH_USER_KEY, null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    user: profileQuery.data as AuthUser | undefined,
    isLoading: profileQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
