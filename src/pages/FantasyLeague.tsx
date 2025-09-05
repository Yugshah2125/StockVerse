import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useTrendingStocks } from "@/hooks/useStocks";
import { 
  Trophy, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target,
  Crown,
  Medal,
  CheckCircle
} from "lucide-react";

const FantasyLeague = () => {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [isDrafted, setIsDrafted] = useState(false);
  const { data: trendingStocks, isLoading } = useTrendingStocks();
  
  const maxSelections = 5;
  const timeRemaining = "--:--:--";

  // Use real stock data or fallback to empty array
  const stocks = trendingStocks || [];

  const handleStockSelection = (symbol: string) => {
    if (isDrafted) return;
    
    if (selectedStocks.includes(symbol)) {
      setSelectedStocks(selectedStocks.filter(s => s !== symbol));
    } else if (selectedStocks.length < maxSelections) {
      setSelectedStocks([...selectedStocks, symbol]);
    }
  };

  const handleSubmitDraft = () => {
    setIsDrafted(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8 text-gold" />
                Fantasy League
              </h1>
              <p className="text-muted-foreground">Draft your winning portfolio and compete against thousands</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2 text-primary border-primary/30">
                <Users className="w-4 h-4" />
                Loading...
              </Badge>
              <Card className="px-4 py-2 bg-gradient-to-r from-loss/10 to-loss/5 border-loss/30">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-loss" />
                  <span className="font-mono text-sm font-bold text-loss">{timeRemaining}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Draft Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Draft Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Selected</span>
                  <span className="font-bold">{selectedStocks.length} / {maxSelections}</span>
                </div>
                <Progress value={(selectedStocks.length / maxSelections) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {isDrafted ? "Draft submitted successfully!" : `Select ${maxSelections - selectedStocks.length} more stocks`}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold" />
                Prize Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gold">$50,000</p>
                <p className="text-xs text-muted-foreground">Virtual currency prizes</p>
                <div className="flex items-center gap-1 text-xs">
                  <Medal className="w-3 h-3 text-gold" />
                  <span>1st: $15k • 2nd: $10k • 3rd: $5k</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-profit" />
                Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-muted-foreground">Not ranked</p>
                <p className="text-xs text-muted-foreground">Join a round to get ranked</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>No data yet</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Selection */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Draft Your Portfolio</CardTitle>
                <CardDescription>
                  Select {maxSelections} stocks that you think will perform best in the next week
                </CardDescription>
              </div>
              {selectedStocks.length === maxSelections && !isDrafted && (
                <Button variant="gaming" size="lg" onClick={handleSubmitDraft}>
                  Submit Draft
                </Button>
              )}
              {isDrafted && (
                <Badge variant="outline" className="gap-2 text-success border-success/30">
                  <CheckCircle className="w-4 h-4" />
                  Draft Submitted
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading live stock data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stocks.map((stock) => {
                const isSelected = selectedStocks.includes(stock.symbol);
                const canSelect = selectedStocks.length < maxSelections || isSelected;
                const isPositive = stock.change > 0;
                
                return (
                  <div
                    key={stock.symbol}
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      isDrafted 
                        ? 'opacity-70 cursor-not-allowed' 
                        : canSelect 
                          ? 'hover:shadow-md hover:border-primary/50' 
                          : 'opacity-50 cursor-not-allowed'
                    } ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/20' 
                        : 'border-border bg-card'
                    }`}
                    onClick={() => canSelect && handleStockSelection(stock.symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={isSelected}
                          disabled={isDrafted || (!canSelect && !isSelected)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{stock.symbol}</span>
                            <Badge variant="secondary" className="text-xs gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Live Data
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                          <p className="text-xs text-muted-foreground">Vol: {stock.volume}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <p className="text-lg font-bold">${stock.price}</p>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          isPositive ? 'text-profit' : 'text-loss'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{isPositive ? '+' : ''}{stock.change} ({isPositive ? '+' : ''}{stock.changePercent}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FantasyLeague;