import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTrendingStocks } from "@/hooks/useStocks";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/hooks/useTrading";
import StockSearch from "@/components/StockSearch";
import TradingModal from "@/components/TradingModal";
import TradingTest from "@/components/TradingTest";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Trophy, 
  Gamepad2, 
  Zap, 
  Target,
  Users,
  Medal,
  ChartBar,
  Flame,
  Search,
  ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: trendingStocks, isLoading: isLoadingStocks } = useTrendingStocks();
  const { data: portfolio } = usePortfolio();
  const [tradingSymbol, setTradingSymbol] = useState<string | null>(null);
  
  // Use real portfolio data or defaults
  const virtualCash = portfolio?.cash || 0;
  const portfolioValue = portfolio?.totalValue || 0;
  const totalReturn = portfolio?.totalReturn || 0;
  const totalReturnPercent = portfolio?.returnPercent || 0;
  const dailyChange = portfolio?.dailyChange || 0;
  const dailyChangePercent = portfolio?.dailyChangePercent || 0;
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpToNext = (level * 1000) - xp;
  const streak = user?.streak || 0;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold">Trading Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}! Ready to make some moves?</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Flame className="w-3 h-3" />
              {streak} day streak
            </Badge>
            <Badge variant="outline" className="gap-1 text-gold border-gold/30">
              <Medal className="w-3 h-3" />
              Level {level}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {/* Virtual Cash */}
          <Card className="bg-gradient-to-br from-card to-card-hover border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold" />
                Virtual Cash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gold">₹{virtualCash.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Available to trade</p>
            </CardContent>
          </Card>

          {/* Portfolio Value */}
          <Card className="bg-gradient-to-br from-card to-card-hover border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ChartBar className="w-4 h-4 text-primary" />
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{portfolioValue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-profit" />
                <p className="text-xs text-profit font-medium">+₹{totalReturn.toLocaleString()} ({totalReturnPercent}%)</p>
              </div>
            </CardContent>
          </Card>

          {/* Daily P&L */}
          <Card className="bg-gradient-to-br from-card to-card-hover border-border/50 hover:shadow-lg hover:shadow-profit/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Daily P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-profit" />
                <p className="text-2xl font-bold text-profit">+₹{dailyChange.toLocaleString()}</p>
              </div>
              <p className="text-xs text-profit font-medium mt-1">+{dailyChangePercent}% today</p>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card className="bg-gradient-to-br from-card to-card-hover border-border/50 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-gold" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Level {level}</span>
                <span className="text-muted-foreground">{xp}/{xpToNext} XP</span>
              </div>
              <Progress value={(xp / xpToNext) * 100} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          
          {/* Fantasy League */}
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center group-hover:animate-glow">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Fantasy League</CardTitle>
                    <CardDescription>Draft stocks like fantasy sports</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  Join to see
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-muted-foreground">Not available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Database</span>
                  <span className="font-medium text-muted-foreground">Not configured</span>
                </div>
              </div>
              
              <Button variant="gaming" size="lg" className="w-full" asChild>
                <Link to="/fantasy-league">
                  Join Next Round
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Trading Challenge */}
          <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20 hover:shadow-xl hover:shadow-profit/20 transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-profit to-green-400 flex items-center justify-center group-hover:animate-profit-pulse">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Trading Challenge</CardTitle>
                    <CardDescription>Complete levels and earn rewards</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1 text-gold border-gold/30">
                  <Medal className="w-3 h-3" />
                  Pro Level
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-muted-foreground">Not available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Database</span>
                  <span className="font-medium text-muted-foreground">Not configured</span>
                </div>
              </div>
              
              <Button variant="profit" size="lg" className="w-full" asChild>
                <Link to="/trading-challenge">
                  Continue Challenge
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mini Games & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          
          {/* Mini Games */}
          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-gold to-yellow-400 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-gold-foreground" />
                </div>
                <div>
                  <CardTitle>Mini-Games</CardTitle>
                  <CardDescription className="text-xs">Quick games & rewards</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="gold" size="sm" className="w-full" asChild>
                <Link to="/mini-games">
                  Play Now
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card className="bg-gradient-to-br from-secondary/50 via-card to-card-hover border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <ChartBar className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription className="text-xs">View holdings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link to="/portfolio">
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription className="text-xs">Global rankings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/leaderboard">
                  View Rankings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Market Data */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Live Market Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStocks ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading market data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingStocks?.map((stock) => (
                  <div key={stock.symbol} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{stock.symbol}</span>
                      <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="text-xs">
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{stock.name}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold">₹{stock.price.toFixed(2)}</span>
                      <div className={`flex items-center gap-1 text-sm ${
                        stock.change >= 0 ? 'text-profit' : 'text-loss'
                      }`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => setTradingSymbol(stock.symbol)}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Trade
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Search */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Find & Trade Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockSearch onSelectStock={(symbol) => setTradingSymbol(symbol)} />
          </CardContent>
        </Card>

        {/* Trading Test */}
        <div className="animate-slide-up">
          <TradingTest />
        </div>
        
        {/* Trading Modal */}
        {tradingSymbol && (
          <TradingModal
            symbol={tradingSymbol}
            isOpen={!!tradingSymbol}
            onClose={() => setTradingSymbol(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;