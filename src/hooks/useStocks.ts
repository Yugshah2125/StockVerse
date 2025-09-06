import { useQuery } from '@tanstack/react-query';
import { stockApi, StockData } from '@/services/stockApi';

// Hook for single stock quote
export const useStockQuote = (symbol: string) => {
  return useQuery<StockData>({
    queryKey: ['stock', symbol],
    queryFn: () => stockApi.getQuote(symbol),
    staleTime: 0, // Always fresh
    refetchInterval: 2000, // Refetch every 2 seconds
    enabled: !!symbol,
  });
};

// Hook for multiple stock quotes
export const useMultipleStocks = (symbols: string[]) => {
  return useQuery<StockData[]>({
    queryKey: ['stocks', symbols],
    queryFn: () => stockApi.getMultipleQuotes(symbols),
    staleTime: Infinity, // Never refetch
    enabled: symbols.length > 0,
  });
};

// Hook for stock search
export const useStockSearch = (keyword: string) => {
  return useQuery({
    queryKey: ['stock-search', keyword],
    queryFn: () => stockApi.searchStocks(keyword),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: keyword.length > 1,
  });
};

// Hook for trending stocks
export const useTrendingStocks = () => {
  return useQuery<StockData[]>({
    queryKey: ['trending-stocks'],
    queryFn: stockApi.getTrendingStocks,
    staleTime: 0, // Always fresh
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};