import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  Medal,
  Crown,
  Flame,
  Zap,
  Shield,
  Gift,
  Edit3
} from "lucide-react";

const Profile = () => {
  const userStats = {
    name: "Alex Chen",
    level: 12,
    xp: 28450,
    xpToNext: 42500,
    totalTrades: 156,
    winRate: 68.5,
    totalReturn: 7.85,
    bestReturn: 24.3,
    streak: 7,
    joinDate: "March 2024",
    avatarInitials: "AC"
  };

  const badges = [
    { 
      id: 1, 
      name: "First Trade", 
      description: "Made your first trade", 
      icon: Target, 
      rarity: "Common", 
      earned: true,
      earnedDate: "Mar 15, 2024"
    },
    { 
      id: 2, 
      name: "Week Warrior", 
      description: "Trade for 7 consecutive days", 
      icon: Flame, 
      rarity: "Uncommon", 
      earned: true,
      earnedDate: "Mar 28, 2024"
    },
    { 
      id: 3, 
      name: "Profit Master", 
      description: "Achieve 10% total return", 
      icon: TrendingUp, 
      rarity: "Rare", 
      earned: false
    },
    { 
      id: 4, 
      name: "Risk Controller", 
      description: "Complete Risk Management challenge", 
      icon: Shield, 
      rarity: "Epic", 
      earned: false
    },
    { 
      id: 5, 
      name: "Market Sage", 
      description: "Reach Level 20", 
      icon: Crown, 
      rarity: "Legendary", 
      earned: false
    },
    { 
      id: 6, 
      name: "Quiz Master", 
      description: "Complete 50 quiz questions", 
      icon: Star, 
      rarity: "Rare", 
      earned: true,
      earnedDate: "Apr 2, 2024"
    }
  ];

  const achievements = [
    { title: "Highest Single Day Gain", value: "+$3,240", date: "Apr 8, 2024" },
    { title: "Longest Winning Streak", value: "12 trades", date: "Mar 25-30, 2024" },
    { title: "Best Weekly Return", value: "+15.7%", date: "Week of Apr 1, 2024" },
    { title: "Most Active Day", value: "8 trades", date: "Apr 5, 2024" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-400 border-gray-400/30 bg-gray-400/5";
      case "Uncommon": return "text-profit border-profit/30 bg-profit/5";
      case "Rare": return "text-primary border-primary/30 bg-primary/5";
      case "Epic": return "text-purple-400 border-purple-400/30 bg-purple-400/5";
      case "Legendary": return "text-gold border-gold/30 bg-gold/5";
      default: return "text-muted-foreground border-muted/30 bg-muted/5";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 lg:pl-78">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground">Your trading journey and achievements</p>
        </div>

        {/* Profile Info */}
        <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20 animate-slide-up">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {userStats.avatarInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{userStats.name}</h2>
                    <p className="text-muted-foreground">Member since {userStats.joinDate}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-xl font-bold text-primary">{userStats.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-xl font-bold">{userStats.totalTrades}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-xl font-bold text-profit">{userStats.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-xl font-bold text-gold flex items-center gap-1">
                      <Flame className="w-5 h-5" />
                      {userStats.streak}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Level Progress</span>
                  <span className="font-medium">{userStats.xp.toLocaleString()} / {userStats.xpToNext.toLocaleString()} XP</span>
                </div>
                <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {(userStats.xpToNext - userStats.xp).toLocaleString()} XP to Level {userStats.level + 1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Performance Stats */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-profit" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-profit/5 border border-profit/20">
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className="text-2xl font-bold text-profit">+{userStats.totalReturn}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
                    <p className="text-sm text-muted-foreground">Best Return</p>
                    <p className="text-2xl font-bold text-gold">+{userStats.bestReturn}%</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Notable Achievements</h4>
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">{achievement.date}</p>
                      </div>
                      <Badge variant="outline" className="text-primary border-primary/30">
                        {achievement.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Collection */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Medal className="w-6 h-6 text-gold" />
                  Badge Collection
                </CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Trophy className="w-3 h-3" />
                  {badges.filter(b => b.earned).length} / {badges.length}
                </Badge>
              </div>
              <CardDescription>
                Unlock badges by completing challenges and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((badge) => {
                  const IconComponent = badge.icon;
                  const rarityStyle = getRarityColor(badge.rarity);
                  
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        badge.earned 
                          ? `${rarityStyle} hover:shadow-md cursor-pointer` 
                          : 'border-border bg-muted/10 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          badge.earned ? 'bg-current/10' : 'bg-muted'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            badge.earned ? 'text-current' : 'text-muted-foreground'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold text-sm ${
                              badge.earned ? '' : 'text-muted-foreground'
                            }`}>
                              {badge.name}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${badge.earned ? rarityStyle : 'text-muted-foreground border-muted/30'}`}
                            >
                              {badge.rarity}
                            </Badge>
                          </div>
                          <p className={`text-xs ${
                            badge.earned ? 'text-muted-foreground' : 'text-muted-foreground/70'
                          }`}>
                            {badge.description}
                          </p>
                          {badge.earned && badge.earnedDate && (
                            <p className="text-xs text-muted-foreground/80 mt-1">
                              Earned {badge.earnedDate}
                            </p>
                          )}
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
    </div>
  );
};

export default Profile;