import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, TrendingUp, Medal, Crown, Award } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/contexts/AuthContext";

const Leaderboard = () => {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { user } = useAuth();
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-gold" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  };
  
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-gold/30 bg-gold/5';
    if (rank === 2) return 'border-gray-400/30 bg-gray-400/5';
    if (rank === 3) return 'border-amber-600/30 bg-amber-600/5';
    return 'border-border';
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Global rankings by portfolio value</p>
        </div>

        {/* Leaderboard */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Top Traders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading rankings...</p>
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.id === user?.id;
                  return (
                    <div 
                      key={entry.id} 
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        getRankColor(entry.rank)
                      } ${
                        isCurrentUser ? 'ring-2 ring-primary/50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10">
                            {getRankIcon(entry.rank)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {entry.name}
                                {isCurrentUser && <span className="text-primary text-sm">(You)</span>}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                Level {entry.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Portfolio Value: ₭{entry.portfolioValue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`flex items-center gap-1 text-sm font-medium ${
                            entry.totalReturn >= 0 ? 'text-profit' : 'text-loss'
                          }`}>
                            {entry.totalReturn >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4 rotate-180" />
                            )}
                            <span>
                              {entry.totalReturn >= 0 ? '+' : ''}₭{entry.totalReturn.toLocaleString()}
                            </span>
                          </div>
                          <p className={`text-xs ${
                            entry.returnPercent >= 0 ? 'text-profit' : 'text-loss'
                          }`}>
                            {entry.returnPercent >= 0 ? '+' : ''}{entry.returnPercent}% returns
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Rankings Available</h3>
                <p className="text-muted-foreground mb-4">
                  Start trading to appear on the leaderboard!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;