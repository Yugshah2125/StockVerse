import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useFantasyLeague } from "@/hooks/useFantasyLeague";
import { useAuth } from "@/contexts/AuthContext";
import { alphaVantageApi } from '@/services/alphaVantageApi';
import { 
  Trophy, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target,
  Crown,
  Medal,
  CheckCircle,
  Coins,
  Star,
  Zap
} from "lucide-react";

const FantasyLeague = () => {
  const { user } = useAuth();
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { allLeagues, userDrafts, loading, submitDraft, getTimeRemaining } = useFantasyLeague();
  
  const maxSelections = 5;

  const handleLeagueSelect = (league) => {
    setSelectedLeague(league);
    const userDraft = userDrafts[league.id];
    if (userDraft?.selectedStocks) {
      setSelectedStocks(userDraft.selectedStocks);
    } else {
      setSelectedStocks([]);
    }
  };

  const handleStockSelection = (symbol) => {
    if (userDrafts[selectedLeague?.id]) return;
    
    if (selectedStocks.includes(symbol)) {
      setSelectedStocks(selectedStocks.filter(s => s !== symbol));
    } else if (selectedStocks.length < maxSelections) {
      setSelectedStocks([...selectedStocks, symbol]);
    }
  };

  const handleSubmitDraft = async () => {
    if (!selectedLeague || selectedStocks.length !== maxSelections) return;
    
    setSubmitting(true);
    try {
      await submitDraft(selectedLeague.id, selectedStocks);
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Fantasy Leagues...</p>
        </div>
      </div>
    );
  }

  if (!selectedLeague) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-gold" />
              Fantasy Leagues
            </h1>
            <p className="text-muted-foreground text-lg">Choose your league and compete for massive prizes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allLeagues.map((league) => {
              const isDrafted = !!userDrafts[league.id];
              const difficultyColors = {
                Easy: 'text-green-500 border-green-500/30 bg-green-500/5',
                Medium: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5',
                Hard: 'text-red-500 border-red-500/30 bg-red-500/5'
              };
              
              return (
                <Card key={league.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${isDrafted ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {league.name === 'Rookie League' && <Star className="w-5 h-5 text-green-500" />}
                        {league.name === 'Pro League' && <Zap className="w-5 h-5 text-yellow-500" />}
                        {league.name === 'Elite League' && <Crown className="w-5 h-5 text-red-500" />}
                        {league.name}
                      </CardTitle>
                      {isDrafted && <CheckCircle className="w-5 h-5 text-primary" />}
                    </div>
                    <Badge variant="outline" className={difficultyColors[league.difficulty]}>
                      {league.difficulty}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entry Fee</p>
                        <p className="font-bold text-lg">₭{league.entryFee.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prize Pool</p>
                        <p className="font-bold text-lg text-gold">₭{league.prizePool.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-bold">{league.duration} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Players</p>
                        <p className="font-bold">{league.participants}/{league.maxParticipants}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Time Remaining</span>
                        <span className="font-mono">{getTimeRemaining(league)}</span>
                      </div>
                      <Progress value={(league.participants / league.maxParticipants) * 100} className="h-2" />
                    </div>
                    
                    <Button 
                      onClick={() => handleLeagueSelect(league)}
                      className="w-full"
                      variant={isDrafted ? "outline" : "default"}
                      disabled={league.participants >= league.maxParticipants}
                    >
                      {isDrafted ? 'View Draft' : league.participants >= league.maxParticipants ? 'Full' : 'Join League'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const isDrafted = !!userDrafts[selectedLeague.id];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedLeague(null)}>
            ← Back to Leagues
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{selectedLeague.name}</h1>
            <p className="text-muted-foreground">Entry Fee: ₭{selectedLeague.entryFee.toLocaleString()} • Prize Pool: ₭{selectedLeague.prizePool.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
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
                  {isDrafted ? "Draft submitted!" : `Select ${maxSelections - selectedStocks.length} more stocks`}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="w-5 h-5 text-gold" />
                Your Kuberon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">₭{user?.virtualCash?.toLocaleString() || '0'}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.virtualCash >= selectedLeague.entryFee ? 'Sufficient funds' : 'Insufficient funds'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                League Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{selectedLeague.participants}/{selectedLeague.maxParticipants}</p>
                <p className="text-xs text-muted-foreground">Players joined</p>
                <p className="text-xs font-mono">{getTimeRemaining(selectedLeague)} left</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Draft Your Portfolio</CardTitle>
                <CardDescription>Select {maxSelections} stocks for {selectedLeague.name}</CardDescription>
              </div>
              {selectedStocks.length === maxSelections && !isDrafted && (
                <Button 
                  variant="gaming" 
                  size="lg" 
                  onClick={handleSubmitDraft}
                  disabled={submitting || user?.virtualCash < selectedLeague.entryFee}
                >
                  {submitting ? 'Submitting...' : `Pay ₭${selectedLeague.entryFee.toLocaleString()} & Submit`}
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
            <div className="space-y-4">
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
                { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' }
              ].map((stock) => {
                const isSelected = selectedStocks.includes(stock.symbol);
                const canSelect = selectedStocks.length < maxSelections || isSelected;
                
                const currentPrice = alphaVantageApi.getSimulatedPrice(stock.symbol);
                const basePrice = alphaVantageApi.getBaselinePrice(stock.symbol);
                const priceChange = currentPrice - basePrice;
                const changePercent = basePrice > 0 ? (priceChange / basePrice) * 100 : 0;
                const isPositive = priceChange >= 0;
                
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
                          </div>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <p className="text-lg font-bold">₭{currentPrice.toLocaleString()}</p>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          isPositive ? 'text-profit' : 'text-loss'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{isPositive ? '+' : ''}₭{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FantasyLeague;