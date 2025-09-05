import { useQuery } from '@tanstack/react-query';
import { api, User } from '@/services/api';

export const useUser = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: api.getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePortfolio = () => {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: api.getPortfolio,
    staleTime: 30 * 1000, // 30 seconds
  });
};