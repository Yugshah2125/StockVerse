import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tradingApi } from '@/services/tradingApi';

// Hook for portfolio data
export const usePortfolio = () => {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: tradingApi.getPortfolio,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Hook for trade history
export const useTradeHistory = () => {
  return useQuery({
    queryKey: ['trade-history'],
    queryFn: tradingApi.getTradeHistory,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Hook for buying stocks
export const useBuyStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ symbol, shares }: { symbol: string; shares: number }) =>
      tradingApi.buyStock(symbol, shares),
    onSuccess: () => {
      // Invalidate and refetch portfolio and trade history
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['trade-history'] });
    },
  });
};

// Hook for selling stocks
export const useSellStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ symbol, shares }: { symbol: string; shares: number }) =>
      tradingApi.sellStock(symbol, shares),
    onSuccess: () => {
      // Invalidate and refetch portfolio and trade history
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['trade-history'] });
    },
  });
};