import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useStockSearch, useStockQuote } from '@/hooks/useStocks';

interface StockSearchProps {
  onSelectStock?: (symbol: string) => void;
}

const StockSearch = ({ onSelectStock }: StockSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');

  const { data: searchResults, isLoading: isSearching } = useStockSearch(searchTerm);
  const { data: stockData, isLoading: isLoadingStock } = useStockQuote(selectedSymbol);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSelectedSymbol('');
  };

  const handleSelectStock = (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchTerm('');
    onSelectStock?.(symbol);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search Indian stocks (e.g., RELIANCE, TCS, HDFC)..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchTerm && searchResults && searchResults.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.symbol}
                  onClick={() => handleSelectStock(result.symbol)}
                  className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{result.symbol}</p>
                      <p className="text-sm text-muted-foreground truncate">{result.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Stock Data */}
      {selectedSymbol && stockData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{stockData.symbol}</h3>
                <p className="text-sm text-muted-foreground">{stockData.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₭{stockData.price.toFixed(2)}</p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stockData.change >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {stockData.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {stockData.change >= 0 ? '+' : ''}₭{stockData.change.toFixed(2)} 
                    ({stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Open</p>
                <p className="font-medium">₭{stockData.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-medium">{stockData.volume}</p>
              </div>
              <div>
                <p className="text-muted-foreground">High</p>
                <p className="font-medium">₭{stockData.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Low</p>
                <p className="font-medium">₭{stockData.low.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading States */}
      {isSearching && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Searching...</p>
        </div>
      )}

      {isLoadingStock && selectedSymbol && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading stock data...</p>
        </div>
      )}
    </div>
  );
};

export default StockSearch;