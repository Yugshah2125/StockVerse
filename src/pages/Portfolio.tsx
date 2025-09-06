import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePortfolio } from "@/hooks/useTrading";
import TradingModal from "@/components/TradingModal";
import { 
  ChartBar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Target,
  PieChart,
  Activity,
  Plus,
  Minus
} from "lucide-react";

const Portfolio = () => {
  const [tradingSymbol, setTradingSymbol] = useState<string | null>(null);
  const [tradingAction, setTradingAction] = useState<'buy' | 'sell'>('buy');
  const { data: portfolio, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6 lg:pl-78">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  const { cash = 0, holdings = [], totalValue = 0, totalReturn = 0, returnPercent = 0 } = portfolio;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 lg:pl-78">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ChartBar className="w-8 h-8 text-primary" />
            Portfolio
          </h1>
          <p className="text-muted-foreground">Track your virtual investments and performance</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold">₭{totalValue.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  totalReturn >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {totalReturn >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {totalReturn >= 0 ? '+' : ''}₭{totalReturn.toFixed(2)} ({totalReturn >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-profit" />
                Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-profit">{holdings.length}</p>
                <p className="text-sm text-muted-foreground">Active positions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-gold" />
                Available Kuberon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gold">₭{cash.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Ready to invest</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <PieChart className="w-6 h-6 text-primary" />
              Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {holdings.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No holdings yet</p>
                <p className="text-sm text-muted-foreground">Start trading to build your portfolio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {holdings.map((holding) => {
                  const isPositive = holding.totalReturn >= 0;
                  const allocation = totalValue > 0 ? (holding.totalValue / totalValue) * 100 : 0;
                  
                  return (
                    <div key={holding.symbol} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-primary text-sm">{holding.symbol}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{holding.symbol}</h3>
                            <p className="text-sm text-muted-foreground">{holding.shares || 0} shares @ ₭{(holding.avgPrice || 0).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-lg">₭{(holding.totalValue || 0).toLocaleString()}</p>
                          <div className={`flex items-center gap-1 text-sm font-medium ${
                            isPositive ? 'text-profit' : 'text-loss'
                          }`}>
                            {isPositive ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span>
                              {isPositive ? '+' : ''}₭{(holding.totalReturn || 0).toFixed(2)} ({isPositive ? '+' : ''}{(holding.returnPercent || 0).toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Avg Price</p>
                          <p className="font-medium">₭{(holding.avgPrice || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Price</p>
                          <p className="font-medium">₭{(holding.currentPrice || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Allocation</p>
                          <p className="font-medium">{allocation.toFixed(1)}%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              setTradingSymbol(holding.symbol);
                              setTradingAction('sell');
                            }}
                          >
                            <Minus className="w-3 h-3 mr-1" />
                            Sell
                          </Button>
                          <Button 
                            variant="profit" 
                            size="sm"
                            onClick={() => {
                              setTradingSymbol(holding.symbol);
                              setTradingAction('buy');
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Buy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress value={allocation} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Trading Modal */}
        {tradingSymbol && (
          <TradingModal
            symbol={tradingSymbol}
            isOpen={!!tradingSymbol}
            onClose={() => setTradingSymbol(null)}
            defaultTab={tradingAction}
          />
        )}
      </div>
    </div>
  );
};

export default Portfolio;