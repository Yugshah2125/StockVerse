import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Settings, Trophy, LogOut, TrendingUp, Medal, Target, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/hooks/useTrading";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const Profile = () => {
  const { user, logout } = useAuth();
  const { data: portfolio } = usePortfolio();
  const { data: leaderboard } = useLeaderboard();
  
  const userLevel = user?.level || 1;
  const userXP = user?.xp || 0;
  const xpToNext = (userLevel * 1000) - userXP;
  const xpProgress = (userXP / (userLevel * 1000)) * 100;
  
  const userRank = leaderboard?.find(entry => entry.id === user?.id)?.rank || 'Unranked';
  const totalUsers = leaderboard?.length || 0;
  
  const joinDate = new Date(2024, 0, 1); // Mock join date
  const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground">Your trading journey and achievements</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">#{userRank}</p>
                <p className="text-sm text-muted-foreground">out of {totalUsers} traders</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Medal className="w-5 h-5 text-gold" />
                Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gold">{userLevel}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>XP Progress</span>
                    <span>{userXP}/{userLevel * 1000}</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-profit" />
                Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-profit">₭{(portfolio?.totalValue || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{portfolio?.holdings?.length || 0} holdings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-semibold">{user?.name || 'Trader'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{user?.email || 'Not available'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trading Since</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-lg">{joinDate.toLocaleDateString()} ({daysSinceJoin} days)</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trading Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="gap-1">
                      <Target className="w-3 h-3" />
                      Active Trader
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Performance</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={portfolio?.totalReturn >= 0 ? "default" : "destructive"} className="gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {portfolio?.totalReturn >= 0 ? 'Profitable' : 'Learning'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Returns</label>
                  <p className={`text-lg font-semibold ${
                    portfolio?.totalReturn >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {portfolio?.totalReturn >= 0 ? '+' : ''}₭{(portfolio?.totalReturn || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t mt-6">
              <Button
                variant="destructive"
                onClick={() => logout()}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;