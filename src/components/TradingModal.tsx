import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStockQuote } from '@/hooks/useStocks';
import { useBuyStock, useSellStock, usePortfolio } from '@/hooks/useTrading';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { toast } from 'sonner';

interface TradingModalProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'buy' | 'sell';
}

const TradingModal = ({ symbol, isOpen, onClose, defaultTab = 'buy' }: TradingModalProps) => {
  const [buyShares, setBuyShares] = useState('');
  const [sellShares, setSellShares] = useState('');
  
  const { data: stockData, isLoading: isLoadingStock } = useStockQuote(symbol);
  const { data: portfolio } = usePortfolio();
  const buyMutation = useBuyStock();
  const sellMutation = useSellStock();
  
  const holding = portfolio?.holdings.find(h => h.symbol === symbol);
  const availableCash = portfolio?.cash || 0;
  const maxBuyShares = stockData?.price ? Math.floor(availableCash / stockData.price) : 0;
  const maxSellShares = holding?.shares || 0;

  const handleBuy = async () => {
    const shares = parseInt(buyShares);
    if (!shares || shares <= 0) {
      toast.error('Please enter a valid number of shares');
      return;
    }
    
    if (!stockData || shares * stockData.price > availableCash) {
      toast.error('Insufficient funds');
      return;
    }

    const result = await buyMutation.mutateAsync({ symbol, shares });
    if (result.success) {
      toast.success(result.message);
      setBuyShares('');
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  const handleSell = async () => {
    const shares = parseInt(sellShares);
    if (!shares || shares <= 0) {
      toast.error('Please enter a valid number of shares');
      return;
    }
    
    if (shares > maxSellShares) {
      toast.error('Insufficient shares');
      return;
    }

    const result = await sellMutation.mutateAsync({ symbol, shares });
    if (result.success) {
      toast.success(result.message);
      setSellShares('');
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  if (!stockData && !isLoadingStock) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Trade {symbol}
            {stockData && (
              <Badge variant={stockData.change >= 0 ? "default" : "destructive"}>
                {stockData.change >= 0 ? '+' : ''}{(stockData.changePercent || 0).toFixed(2)}%
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {stockData ? stockData.name : 'Loading...'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingStock ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock data...</p>
          </div>
        ) : stockData ? (
          <div className="space-y-6">
            {/* Stock Info */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="text-2xl font-bold">₭{(stockData.price || 0).toFixed(2)}</p>
                <div className={`flex items-center gap-1 text-sm ${
                  stockData.change >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {stockData.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {stockData.change >= 0 ? '+' : ''}₭{(stockData.change || 0).toFixed(2)} today
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Vol: {stockData.volume}</p>
                <p>High: ₭{(stockData.high || 0).toFixed(2)}</p>
                <p>Low: ₭{(stockData.low || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Portfolio Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold" />
                <div>
                  <p className="text-muted-foreground">Available Kuberon</p>
                  <p className="font-bold">₭{availableCash.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-muted-foreground">Owned Shares</p>
                  <p className="font-bold">{maxSellShares}</p>
                </div>
              </div>
            </div>

            {/* Trading Tabs */}
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell" disabled={maxSellShares === 0}>
                  Sell
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-shares">Number of Shares</Label>
                  <Input
                    id="buy-shares"
                    type="number"
                    placeholder="0"
                    value={buyShares}
                    onChange={(e) => setBuyShares(e.target.value)}
                    max={maxBuyShares}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max: {maxBuyShares} shares (₭{(maxBuyShares * (stockData.price || 0)).toLocaleString()})
                  </p>
                </div>
                
                {buyShares && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between text-sm">
                      <span>Total Cost:</span>
                      <span className="font-bold">
                        ₭{(parseInt(buyShares) * (stockData.price || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleBuy}
                  disabled={!buyShares || buyMutation.isPending}
                  className="w-full"
                  variant="profit"
                >
                  {buyMutation.isPending ? 'Buying...' : 'Buy Shares'}
                </Button>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sell-shares">Number of Shares</Label>
                  <Input
                    id="sell-shares"
                    type="number"
                    placeholder="0"
                    value={sellShares}
                    onChange={(e) => setSellShares(e.target.value)}
                    max={maxSellShares}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max: {maxSellShares} shares
                  </p>
                </div>
                
                {sellShares && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between text-sm">
                      <span>Total Value:</span>
                      <span className="font-bold">
                        ₭{(parseInt(sellShares) * (stockData.price || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleSell}
                  disabled={!sellShares || sellMutation.isPending}
                  className="w-full"
                  variant="destructive"
                >
                  {sellMutation.isPending ? 'Selling...' : 'Sell Shares'}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TradingModal;