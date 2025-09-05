import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTrendingStocks } from "@/hooks/useStocks";
import { getUserStats } from "@/services/userStats";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Gamepad2, 
  Target,
  Users,
  Medal,
  ChartBar,
  Zap,
  DollarSign,
  ArrowRight,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Home = () => {
  const { data: trendingStocks, isLoading: isLoadingStocks } = useTrendingStocks();
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeTraders: 0 });

  useEffect(() => {
    const fetchUserStats = async () => {
      const stats = await getUserStats();
      setUserStats(stats);
    };
    fetchUserStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="StockVerse" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold">StockVerse</h1>
                <p className="text-sm text-muted-foreground">Invest Smart, Level Up Fast.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="gaming" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 lg:px-6 bg-gradient-to-br from-background via-primary/5 to-profit/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-slide-up">
            <Badge variant="secondary" className="mb-6 gap-2">
              <Zap className="w-4 h-4" />
              India's #1 Virtual Trading Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Master Indian{" "}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-profit bg-clip-text text-transparent animate-gold-shimmer bg-[length:200%_auto]">
                Stock Trading
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Trade NSE/BSE stocks with virtual money, compete in fantasy leagues, and climb leaderboards. 
              <strong className="text-foreground"> No real money at risk!</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button variant="hero" size="xl" className="gap-2" asChild>
                <Link to="/auth">
                  <DollarSign className="w-5 h-5" />
                  Claim ₹10L Free & Start
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">₹10,00,000</div>
                <p className="text-sm text-muted-foreground">Starting Virtual Cash</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-profit mb-2">{userStats.activeTraders > 0 ? `${userStats.activeTraders}+` : '0'}</div>
                <p className="text-sm text-muted-foreground">Active Traders</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Indian Stocks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Ticker */}
      <section className="py-8 bg-card/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="w-5 h-5 text-profit" />
            <span className="font-semibold">Live Market Data</span>
            <Badge variant="secondary" className="gap-1">
              <div className="w-2 h-2 bg-profit rounded-full animate-pulse"></div>
              Real-time
            </Badge>
          </div>
          
          {isLoadingStocks ? (
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
              <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
              <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
            </div>
          ) : (
            <div className="flex items-center gap-6 overflow-x-auto">
              {trendingStocks?.map((stock) => (
                <div key={stock.symbol} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="font-bold">{stock.symbol}</span>
                  <span className="font-medium">₹{stock.price.toFixed(2)}</span>
                  <span className={`text-sm font-medium ${
                    stock.change >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Where Trading Meets{" "}
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                Gaming
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the thrill of stock trading with gamification elements that make learning fun and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fantasy League */}
            <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mb-4 group-hover:animate-glow">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Fantasy League</CardTitle>
                <CardDescription>
                  Draft your dream portfolio and compete against thousands of players in weekly tournaments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{userStats.totalUsers > 0 ? `${userStats.totalUsers} active players` : 'Be the first player'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Medal className="w-4 h-4 text-gold" />
                    <span>₹50,000 prize pool</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Challenge */}
            <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20 hover:shadow-xl hover:shadow-profit/20 transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-profit to-green-400 flex items-center justify-center mb-4 group-hover:animate-profit-pulse">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Trading Challenges</CardTitle>
                <CardDescription>
                  Complete daily and weekly challenges to earn XP, level up, and unlock exclusive rewards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-profit" />
                    <span>50+ unique challenges</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-gold" />
                    <span>Level-based progression</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Management */}
            <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-gold to-yellow-400 flex items-center justify-center mb-4 group-hover:animate-gold-pulse">
                  <ChartBar className="w-8 h-8 text-gold-foreground" />
                </div>
                <CardTitle className="text-2xl">Smart Portfolio</CardTitle>
                <CardDescription>
                  Advanced portfolio analytics, real-time P&L tracking, and AI-powered insights for better decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-profit" />
                    <span>Real-time analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                    <span>Gamified experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-profit/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                Trading Journey?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {userStats.totalUsers > 0 
                ? `Join ${userStats.totalUsers}+ traders who are already mastering the Indian stock market with StockVerse.`
                : 'Be among the first traders to master the Indian stock market with StockVerse.'
              }
            </p>
            
            <div className="bg-muted/30 p-6 rounded-xl border border-gold/20 mb-8 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-6 h-6 text-gold" />
                <span className="font-bold text-gold text-lg">Starting Bonus</span>
              </div>
              <p className="text-3xl font-bold text-gold mb-2">₹10,00,000</p>
              <p className="text-sm text-muted-foreground">Virtual cash to start trading immediately</p>
            </div>

            <Button variant="hero" size="xl" className="gap-2" asChild>
              <Link to="/auth">
                <Trophy className="w-5 h-5" />
                Claim Your ₹10L & Start Trading
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="StockVerse" className="h-10 w-auto" />
              <div>
                <p className="font-semibold">StockVerse</p>
                <p className="text-sm text-muted-foreground">Invest Smart, Level Up Fast.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 StockVerse. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;