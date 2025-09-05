import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Flame,
  Star
} from "lucide-react";

const Leaderboard = () => {
  const globalLeaders = [
    { rank: 1, name: "TradingKing", returns: 45.7, xp: 125000, level: 25, streak: 15, avatar: "TK" },
    { rank: 2, name: "MarketMaster", returns: 42.3, xp: 118000, level: 24, streak: 12, avatar: "MM" },
    { rank: 3, name: "StockSage", returns: 39.1, xp: 112000, level: 23, streak: 8, avatar: "SS" },
    { rank: 4, name: "BullRider", returns: 36.8, xp: 108000, level: 22, streak: 22, avatar: "BR" },
    { rank: 5, name: "WolfOfTech", returns: 34.2, xp: 105000, level: 22, streak: 5, avatar: "WT" },
    { rank: 6, name: "QuantQueen", returns: 32.9, xp: 102000, level: 21, streak: 18, avatar: "QQ" },
    { rank: 7, name: "DiamondHands", returns: 31.5, xp: 98000, level: 21, streak: 10, avatar: "DH" },
    { rank: 847, name: "You (Alex Chen)", returns: 7.85, xp: 28450, level: 12, streak: 7, avatar: "AC", isUser: true },
  ];

  const friends = [
    { rank: 1, name: "Sarah Kim", returns: 12.4, xp: 32000, level: 13, streak: 9, avatar: "SK" },
    { rank: 2, name: "You (Alex Chen)", returns: 7.85, xp: 28450, level: 12, streak: 7, avatar: "AC", isUser: true },
    { rank: 3, name: "Mike Johnson", returns: 5.2, xp: 25000, level: 11, streak: 4, avatar: "MJ" },
    { rank: 4, name: "Lisa Wong", returns: 3.1, xp: 22000, level: 10, streak: 2, avatar: "LW" },
  ];

  const dailyLeaders = [
    { rank: 1, name: "DayTrader99", returns: 8.7, xp: 89000, level: 19, streak: 3, avatar: "DT" },
    { rank: 2, name: "QuickGains", returns: 6.4, xp: 76000, level: 17, streak: 1, avatar: "QG" },
    { rank: 3, name: "FlashTrade", returns: 5.9, xp: 71000, level: 16, streak: 2, avatar: "FT" },
    { rank: 156, name: "You (Alex Chen)", returns: 2.17, xp: 28450, level: 12, streak: 7, avatar: "AC", isUser: true },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number, isUser: boolean = false) => {
    if (isUser) return "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30";
    if (rank === 1) return "bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/10 to-gray-400/5 border-gray-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/10 to-amber-600/5 border-amber-600/30";
    return "bg-card border-border";
  };

  const LeaderboardList = ({ leaders }: { leaders: typeof globalLeaders }) => (
    <div className="space-y-3">
      {leaders.map((leader) => (
        <Card 
          key={leader.rank} 
          className={`transition-all duration-300 hover:shadow-md ${getRankBackground(leader.rank, leader.isUser)}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="w-12 flex justify-center">
                {getRankIcon(leader.rank)}
              </div>
              
              {/* Avatar & Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={`font-bold ${
                    leader.rank === 1 ? 'bg-gold text-gold-foreground' :
                    leader.rank === 2 ? 'bg-gray-400 text-white' :
                    leader.rank === 3 ? 'bg-amber-600 text-white' :
                    leader.isUser ? 'bg-primary text-primary-foreground' :
                    'bg-muted'
                  }`}>
                    {leader.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${leader.isUser ? 'text-primary' : ''}`}>
                    {leader.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      Level {leader.level}
                    </Badge>
                    {leader.streak > 0 && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Flame className="w-2 h-2" />
                        {leader.streak}d
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-right">
                <div className={`flex items-center gap-1 font-bold ${
                  leader.returns >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{leader.returns >= 0 ? '+' : ''}{leader.returns}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {leader.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 lg:pl-78">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Compete with traders from around the world</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Active Traders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">24,891</p>
                <p className="text-sm text-muted-foreground">Competing this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-gold" />
                Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gold">#847</p>
                <div className="flex items-center gap-1 text-sm text-profit">
                  <TrendingUp className="w-3 h-3" />
                  <span>+23 positions this week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-profit" />
                Best Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-profit">+7.85%</p>
                <p className="text-sm text-muted-foreground">Your all-time best</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl">Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="global" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="global" className="gap-2">
                  <Trophy className="w-4 h-4" />
                  Global
                </TabsTrigger>
                <TabsTrigger value="friends" className="gap-2">
                  <Users className="w-4 h-4" />
                  Friends
                </TabsTrigger>
                <TabsTrigger value="daily" className="gap-2">
                  <Clock className="w-4 h-4" />
                  24 Hours
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="global" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Top Traders (All Time)</h3>
                    <Badge variant="outline" className="gap-1">
                      <Users className="w-3 h-3" />
                      24.9k participants
                    </Badge>
                  </div>
                  <LeaderboardList leaders={globalLeaders} />
                </div>
              </TabsContent>
              
              <TabsContent value="friends" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Friends</h3>
                    <Badge variant="outline" className="gap-1">
                      <Users className="w-3 h-3" />
                      4 friends
                    </Badge>
                  </div>
                  <LeaderboardList leaders={friends} />
                </div>
              </TabsContent>
              
              <TabsContent value="daily" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Today's Best Performers</h3>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      Resets at midnight
                    </Badge>
                  </div>
                  <LeaderboardList leaders={dailyLeaders} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;