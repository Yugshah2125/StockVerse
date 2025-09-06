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
import { FeatureLock } from "@/components/FeatureLock";
import { calculateLevelInfo, getLevelTheme } from "@/utils/levelSystem";

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
  ShoppingCart,
  PieChart
} from "lucide-react";
import { Link } from "react-router-dom";
import { alphaVantageApi } from '@/services/alphaVantageApi';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: trendingStocks, isLoading: isLoadingStocks } = useTrendingStocks();
  const { data: portfolio } = usePortfolio();
  const [tradingSymbol, setTradingSymbol] = useState<string | null>(null);
  const [tradingAction, setTradingAction] = useState<'buy' | 'sell'>('buy');
  
  // Use real portfolio data or defaults
  const virtualCash = portfolio?.cash || 0;
  const portfolioValue = portfolio?.totalValue || 0;
  const totalReturn = portfolio?.totalReturn || 0;
  const totalReturnPercent = portfolio?.returnPercent || 0;
  const dailyChange = portfolio?.dailyChange || 0;
  const dailyChangePercent = portfolio?.dailyChangePercent || 0;
  const levelInfo = calculateLevelInfo(user?.xp || 0);
  const levelTheme = getLevelTheme(levelInfo.level);
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
            <Badge variant="outline" className={`gap-1 border-opacity-50 ${levelTheme.accent} border-current`}>
              <Medal className="w-3 h-3" />
              Level {levelInfo.level}
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
                Kuberon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gold">₭{virtualCash.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">₭{portfolioValue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-profit" />
                <p className="text-xs text-profit font-medium">+₭{totalReturn.toLocaleString()} ({totalReturnPercent}%)</p>
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
                <p className="text-2xl font-bold text-profit">+₭{dailyChange.toLocaleString()}</p>
              </div>
              <p className="text-xs text-profit font-medium mt-1">+{dailyChangePercent}% today</p>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card className={`bg-gradient-to-br ${levelTheme.bg} border-border/50 hover:shadow-lg ${levelTheme.glow} transition-all duration-300`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className={`w-4 h-4 ${levelTheme.accent}`} />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Level {levelInfo.level}</span>
                <span className="text-muted-foreground">{levelInfo.xpInCurrentLevel}/{levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel} XP</span>
              </div>
              <Progress value={levelInfo.progressPercent} className="h-2" />
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
          <FeatureLock featureKey="trading-challenge">
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
                    <span className="text-muted-foreground">Current Level</span>
                    <span className="font-medium">Level {levelInfo.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Required</span>
                    <span className="font-medium text-profit">Level 3+</span>
                  </div>
                </div>
                
                <Button variant="profit" size="lg" className="w-full" asChild>
                  <Link to="/trading-challenge">
                    Continue Challenge
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FeatureLock>
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
              <Button variant="default" size="sm" className="w-full bg-gold hover:bg-gold/90 text-black font-medium" asChild>
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

        {/* Top Index Funds */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <PieChart className="w-6 h-6 text-primary" />
              Top Index Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Live Index Fund Data */}
              {[
                { symbol: 'NIFTY50', name: 'Top 50 Large Cap Stocks', displayName: 'NIFTY 50' },
                { symbol: 'NIFTYBANK', name: 'Banking Sector Index', displayName: 'NIFTY BANK' },
                { symbol: 'NIFTYIT', name: 'Information Technology', displayName: 'NIFTY IT' },
                { symbol: 'SENSEX', name: 'BSE 30 Benchmark Index', displayName: 'SENSEX' }
              ].map((index) => {
                // Use Alpha Vantage daily baseline + mock system
                const currentPrice = alphaVantageApi.getSimulatedPrice(index.symbol);
                const basePrice = alphaVantageApi.getBaselinePrice(index.symbol);
                const priceChange = currentPrice - basePrice;
                const changePercent = basePrice > 0 ? (priceChange / basePrice) * 100 : 0;
                
                return (
                  <div key={index.symbol} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{index.displayName}</span>
                      <Badge variant={changePercent >= 0 ? "default" : "destructive"} className="text-xs">
                        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{index.name}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold">₭{currentPrice.toLocaleString()}</span>
                      <div className={`flex items-center gap-1 text-sm ${
                        changePercent >= 0 ? 'text-profit' : 'text-loss'
                      }`}>
                        {changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{changePercent >= 0 ? '+' : ''}₭{priceChange.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setTradingSymbol(index.symbol);
                        setTradingAction('buy');
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Invest
                    </Button>
                  </div>
                );
              })}
            </div>
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

        {/* All Stocks List */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ChartBar className="w-6 h-6 text-primary" />
              All Available Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
                { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
                { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
                { symbol: 'INFY', name: 'Infosys Ltd.' },
                { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
                { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
                { symbol: 'ITC', name: 'ITC Ltd.' },
                { symbol: 'SBIN', name: 'State Bank of India' },
                { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
                { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
                { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
                { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
                { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
                { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
                { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.' },
                { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
                { symbol: 'WIPRO', name: 'Wipro Ltd.' },
                { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.' },
                { symbol: 'NESTLEIND', name: 'Nestle India Ltd.' },
                { symbol: 'TITAN', name: 'Titan Company Ltd.' },
                { symbol: 'BANKBARODA', name: 'Bank of Baroda' },
                { symbol: 'PNB', name: 'Punjab National Bank' },
                { symbol: 'CANBK', name: 'Canara Bank' },
                { symbol: 'UNIONBANK', name: 'Union Bank of India' },
                { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.' },
                { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
                { symbol: 'LTIM', name: 'LTIMindtree Ltd.' },
                { symbol: 'MPHASIS', name: 'Mphasis Ltd.' },
                { symbol: 'COFORGE', name: 'Coforge Ltd.' },
                { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
                { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
                { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.' },
                { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
                { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
                { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.' },
                { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories Ltd.' },
                { symbol: 'CIPLA', name: 'Cipla Ltd.' },
                { symbol: 'BIOCON', name: 'Biocon Ltd.' },
                { symbol: 'LUPIN', name: 'Lupin Ltd.' },
                { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
                { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
                { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.' },
                { symbol: 'VEDL', name: 'Vedanta Ltd.' },
                { symbol: 'COALINDIA', name: 'Coal India Ltd.' },
                { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd.' },
                { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.' },
                { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.' },
                { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Ltd.' },
                { symbol: 'GAIL', name: 'GAIL (India) Ltd.' },
                { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.' },
                { symbol: 'DABUR', name: 'Dabur India Ltd.' },
                { symbol: 'MARICO', name: 'Marico Ltd.' },
                { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd.' },
                { symbol: 'COLPAL', name: 'Colgate Palmolive (India) Ltd.' },
                { symbol: 'JIO', name: 'Reliance Jio Infocomm Ltd.' },
                { symbol: 'IDEA', name: 'Vodafone Idea Ltd.' },
                { symbol: 'SHREECEM', name: 'Shree Cement Ltd.' },
                { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd.' },
                { symbol: 'ACC', name: 'ACC Ltd.' },
                { symbol: 'DLF', name: 'DLF Ltd.' },
                { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd.' },
                { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd.' },
                { symbol: 'NTPC', name: 'NTPC Ltd.' },
                { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.' },
                { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd.' },
                { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd.' },
                { symbol: 'SPICEJET', name: 'SpiceJet Ltd.' },
                { symbol: 'DMART', name: 'Avenue Supermarts Ltd.' },
                { symbol: 'TRENT', name: 'Trent Ltd.' },
                { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.' },
                { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.' },
                { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Company Ltd.' },
                { symbol: 'ZOMATO', name: 'Zomato Ltd.' },
                { symbol: 'PAYTM', name: 'One 97 Communications Ltd.' },
                { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd.' },
                { symbol: 'POLICYBZR', name: 'PB Fintech Ltd.' },
                { symbol: 'CARTRADE', name: 'CarTrade Tech Ltd.' }
              ].map((stock) => {
                const currentPrice = alphaVantageApi.getSimulatedPrice(stock.symbol);
                const basePrice = alphaVantageApi.getBaselinePrice(stock.symbol);
                const priceChange = currentPrice - basePrice;
                const changePercent = basePrice > 0 ? (priceChange / basePrice) * 100 : 0;
                
                return (
                  <div key={stock.symbol} className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{stock.symbol}</span>
                      <Badge variant={changePercent >= 0 ? "default" : "destructive"} className="text-xs">
                        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{stock.name}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold">₭{currentPrice.toLocaleString()}</span>
                      <div className={`flex items-center gap-1 text-xs ${
                        changePercent >= 0 ? 'text-profit' : 'text-loss'
                      }`}>
                        {changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{changePercent >= 0 ? '+' : ''}₭{priceChange.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => {
                        setTradingSymbol(stock.symbol);
                        setTradingAction('buy');
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Trade
                    </Button>
                  </div>
                );
              })}
            </div>
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

export default Dashboard;