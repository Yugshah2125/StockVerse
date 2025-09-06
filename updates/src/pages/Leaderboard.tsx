import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, TrendingUp, Crown, Medal, Award, RefreshCw, ChevronDown, Shield } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error, loadMore, refresh } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/40 border border-yellow-300">
        <Crown className="w-6 h-6 text-yellow-900" />
      </div>
    );
    if (rank === 2) return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-400/40 border border-gray-300">
        <Shield className="w-6 h-6 text-gray-800" />
      </div>
    );
    if (rank === 3) return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-amber-600 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/40 border border-orange-400">
        <Award className="w-6 h-6 text-orange-900" />
      </div>
    );
    return (
      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
        <span className="text-sm font-semibold text-slate-200">#{rank}</span>
      </div>
    );
  };

  const getRankStyle = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser && rank <= 3) {
      if (rank === 1) return "bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-200 border-2 border-yellow-400 shadow-xl shadow-yellow-500/20 ring-2 ring-teal-400/60";
      if (rank === 2) return "bg-gradient-to-br from-gray-100 via-slate-50 to-gray-200 border-2 border-gray-400 shadow-xl shadow-gray-400/20 ring-2 ring-teal-400/60";
      if (rank === 3) return "bg-gradient-to-br from-orange-100 via-amber-100 to-orange-200 border-2 border-orange-400 shadow-xl shadow-orange-500/20 ring-2 ring-teal-400/60";
    }
    if (isCurrentUser) return "bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-teal-400/70 ring-2 ring-teal-400/40 shadow-xl shadow-teal-500/15";
    if (rank === 1) return "bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-200 border-2 border-yellow-400 shadow-xl shadow-yellow-500/15";
    if (rank === 2) return "bg-gradient-to-br from-gray-100 via-slate-50 to-gray-200 border-2 border-gray-400 shadow-xl shadow-gray-400/15";
    if (rank === 3) return "bg-gradient-to-br from-orange-100 via-amber-100 to-orange-200 border-2 border-orange-400 shadow-xl shadow-orange-500/15";
    return "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 hover:border-slate-500 hover:shadow-lg transition-all duration-300";
  };

  const getRankTextColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser && rank <= 3) {
      if (rank === 1) return "text-yellow-900";
      if (rank === 2) return "text-gray-800";
      if (rank === 3) return "text-orange-900";
    }
    if (isCurrentUser) return "text-slate-100";
    if (rank === 1) return "text-yellow-900";
    if (rank === 2) return "text-gray-800";
    if (rank === 3) return "text-orange-900";
    return "text-slate-100";
  };

  const getPortfolioTextStyle = (rank: number, isCurrentUser: boolean) => {
    if (rank <= 3) return "text-2xl font-bold tracking-tight font-mono";
    if (isCurrentUser) return "text-xl font-bold text-slate-100 font-mono";
    return "text-lg font-semibold text-slate-200 font-mono";
  };

  const getSubTextColor = (rank: number, isCurrentUser: boolean) => {
    if (rank <= 3 && !isCurrentUser) return "text-slate-700";
    if (isCurrentUser && rank <= 3) return "text-slate-600";
    if (isCurrentUser) return "text-slate-400";
    return "text-slate-400";
  };

  if (isLoading && data.users.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Rankings</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8 text-gold" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground">Portfolio value rankings • {data.totalUsers.toLocaleString()} traders</p>
            </div>
            <Button onClick={refresh} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Current User Rank */}
        {data.currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-slide-up"
          >
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">#{data.currentUserRank}</span>
                    </div>
                    <div>
                      <p className="font-semibold">Your Rank</p>
                      <p className="text-sm text-muted-foreground">Out of {data.totalUsers.toLocaleString()} traders</p>
                    </div>
                  </div>
                  <Badge variant="secondary">You</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Rankings */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Top Traders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.users.map((leaderUser, index) => {
                const isCurrentUser = user?.id === leaderUser.id;
                
                return (
                  <motion.div
                    key={leaderUser.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
                      getRankStyle(leaderUser.rank, isCurrentUser)
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(leaderUser.rank)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-xl ${getRankTextColor(leaderUser.rank, isCurrentUser)}`}>
                              {leaderUser.name}
                            </h3>
                            {isCurrentUser && (
                              <Badge className="bg-teal-500 text-white font-semibold px-3 py-1 text-xs rounded-full shadow-md">You</Badge>
                            )}
                            {leaderUser.rank <= 3 && !isCurrentUser && (
                              <Badge className={`font-semibold px-3 py-1 text-xs rounded-full shadow-sm ${
                                leaderUser.rank === 1 ? 'bg-yellow-200 text-yellow-900 border border-yellow-300' :
                                leaderUser.rank === 2 ? 'bg-gray-200 text-gray-800 border border-gray-300' :
                                'bg-orange-200 text-orange-900 border border-orange-300'
                              }`}>
                                {leaderUser.rank === 1 ? 'Champion' : leaderUser.rank === 2 ? 'Elite Trader' : 'Rising Star'}
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm font-medium ${getSubTextColor(leaderUser.rank, isCurrentUser)}`}>
                            Joined {leaderUser.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`${getPortfolioTextStyle(leaderUser.rank, isCurrentUser)} ${getRankTextColor(leaderUser.rank, isCurrentUser)} font-mono`}>
                          ₹{leaderUser.portfolioValue.toLocaleString()}
                        </p>
                        <p className={`text-sm font-medium ${getSubTextColor(leaderUser.rank, isCurrentUser)}`}>Portfolio Value</p>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Load More */}
            {data.hasMore && (
              <div className="text-center pt-6">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
            
            {!data.hasMore && data.users.length > 0 && (
              <div className="text-center pt-6">
                <p className="text-sm text-muted-foreground">
                  Showing all {data.users.length} traders
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