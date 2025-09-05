import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Trophy, 
  Lock, 
  CheckCircle, 
  Target, 
  TrendingUp,
  Star,
  Medal,
  Flame,
  Crown,
  Shield
} from "lucide-react";

const TradingChallenge = () => {
  const challenges = [
    {
      id: 1,
      title: "Market Rookie",
      description: "Learn the basics of trading",
      level: "Beginner",
      difficulty: 1,
      status: "completed",
      progress: 100,
      reward: "1,000 XP",
      rewardIcon: Star,
      tasks: ["Make your first trade", "Hold a stock for 24h", "Place a limit order"],
      completedTasks: 3,
      totalTasks: 3,
      badge: "First Trader",
      unlocked: true
    },
    {
      id: 2,
      title: "Trend Spotter",
      description: "Identify and capitalize on market trends",
      level: "Beginner",
      difficulty: 2,
      status: "completed",
      progress: 100,
      reward: "2,500 XP",
      rewardIcon: TrendingUp,
      tasks: ["Identify 3 trending stocks", "Profit from an uptrend", "Avoid a downtrend"],
      completedTasks: 3,
      totalTasks: 3,
      badge: "Trend Master",
      unlocked: true
    },
    {
      id: 3,
      title: "Sector Rotation Pro",
      description: "Master sector rotation strategies",
      level: "Intermediate",
      difficulty: 3,
      status: "active",
      progress: 60,
      reward: "5,000 XP",
      rewardIcon: Target,
      tasks: ["Trade in 3 different sectors", "Achieve 10% profit", "Beat sector benchmark", "Hold for 1 week", "Maintain risk below 5%"],
      completedTasks: 3,
      totalTasks: 5,
      badge: "Sector Specialist",
      unlocked: true
    },
    {
      id: 4,
      title: "Risk Management Elite",
      description: "Advanced risk management techniques",
      level: "Intermediate",
      difficulty: 4,
      status: "locked",
      progress: 0,
      reward: "7,500 XP",
      rewardIcon: Shield,
      tasks: ["Use stop-loss orders", "Diversify across 5+ stocks", "Limit position sizes", "Hedge with options"],
      completedTasks: 0,
      totalTasks: 4,
      badge: "Risk Controller",
      unlocked: false
    },
    {
      id: 5,
      title: "Options Strategist",
      description: "Complex options trading strategies",
      level: "Advanced",
      difficulty: 5,
      status: "locked",
      progress: 0,
      reward: "10,000 XP",
      rewardIcon: Zap,
      tasks: ["Execute covered calls", "Trade spreads", "Profit from volatility", "Manage Greeks"],
      completedTasks: 0,
      totalTasks: 4,
      badge: "Options Master",
      unlocked: false
    },
    {
      id: 6,
      title: "Market Wizard",
      description: "Ultimate trading mastery",
      level: "Expert",
      difficulty: 6,
      status: "locked",
      progress: 0,
      reward: "25,000 XP",
      rewardIcon: Crown,
      tasks: ["Achieve 50% annual return", "Trade in all market conditions", "Create trading algorithm", "Mentor other traders"],
      completedTasks: 0,
      totalTasks: 4,
      badge: "Grand Master",
      unlocked: false
    }
  ];

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "text-profit border-profit/30";
    if (difficulty <= 4) return "text-warning border-warning/30";
    return "text-loss border-loss/30";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-profit/10 text-profit border-profit/30";
      case "Intermediate": return "bg-warning/10 text-warning border-warning/30";
      case "Advanced": return "bg-loss/10 text-loss border-loss/30";
      case "Expert": return "bg-gold/10 text-gold border-gold/30";
      default: return "bg-muted/10 text-muted-foreground border-muted/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-profit" />;
      case "active": return <Flame className="w-5 h-5 text-primary animate-pulse" />;
      case "locked": return <Lock className="w-5 h-5 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                Trading Challenge
              </h1>
              <p className="text-muted-foreground">Progress through levels and master the art of trading</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Card className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold">Level 12 • 28,450 XP</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-profit" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-profit">2</p>
                <p className="text-sm text-muted-foreground">Challenges mastered</p>
                <div className="flex items-center gap-1 text-xs text-profit">
                  <Medal className="w-3 h-3" />
                  <span>2 badges earned</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">1</p>
                <p className="text-sm text-muted-foreground">Current challenge</p>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Target className="w-3 h-3" />
                  <span>60% progress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold" />
                Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gold">42,500</p>
                <p className="text-sm text-muted-foreground">XP to next level</p>
                <div className="flex items-center gap-1 text-xs text-gold">
                  <Star className="w-3 h-3" />
                  <span>Premium badges unlocked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Grid */}
        <div className="space-y-6 animate-slide-up">
          <h2 className="text-2xl font-bold">Challenge Progression</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => {
              const RewardIcon = challenge.rewardIcon;
              
              return (
                <Card 
                  key={challenge.id} 
                  className={`transition-all duration-300 ${
                    challenge.status === 'active' 
                      ? 'border-primary/50 bg-gradient-to-br from-primary/5 via-card to-card-hover shadow-lg shadow-primary/20' 
                      : challenge.status === 'completed'
                        ? 'border-profit/30 bg-gradient-to-br from-profit/5 via-card to-card-hover'
                        : 'border-border bg-card opacity-75'
                  } ${
                    challenge.unlocked && challenge.status !== 'completed' 
                      ? 'hover:shadow-lg hover:shadow-primary/10 cursor-pointer' 
                      : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(challenge.status)}
                          <CardTitle className="text-xl">{challenge.title}</CardTitle>
                        </div>
                        <CardDescription>{challenge.description}</CardDescription>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getLevelColor(challenge.level)}>
                            {challenge.level}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            Difficulty {challenge.difficulty}/6
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <RewardIcon className="w-4 h-4 text-gold" />
                          <span className="text-sm font-bold text-gold">{challenge.reward}</span>
                        </div>
                        {challenge.status === 'completed' && (
                          <Badge variant="outline" className="gap-1 text-profit border-profit/30">
                            <Medal className="w-3 h-3" />
                            {challenge.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    {challenge.status !== 'locked' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {challenge.completedTasks}/{challenge.totalTasks} tasks
                          </span>
                        </div>
                        <Progress 
                          value={challenge.progress} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    {/* Tasks List */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Tasks:</p>
                      <div className="space-y-1">
                        {challenge.tasks.slice(0, 3).map((task, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {index < challenge.completedTasks ? (
                              <CheckCircle className="w-3 h-3 text-profit flex-shrink-0" />
                            ) : challenge.status === 'locked' ? (
                              <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-muted-foreground flex-shrink-0" />
                            )}
                            <span className={
                              index < challenge.completedTasks 
                                ? "text-muted-foreground line-through" 
                                : challenge.status === 'locked'
                                  ? "text-muted-foreground"
                                  : ""
                            }>
                              {task}
                            </span>
                          </div>
                        ))}
                        {challenge.tasks.length > 3 && (
                          <p className="text-xs text-muted-foreground ml-5">
                            +{challenge.tasks.length - 3} more tasks...
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-2">
                      {challenge.status === 'locked' ? (
                        <Button variant="outline" disabled className="w-full">
                          <Lock className="w-4 h-4 mr-2" />
                          Complete previous challenges to unlock
                        </Button>
                      ) : challenge.status === 'completed' ? (
                        <Button variant="success" disabled className="w-full">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Challenge Completed
                        </Button>
                      ) : (
                        <Button variant="gaming" className="w-full">
                          <Target className="w-4 h-4 mr-2" />
                          Continue Challenge
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChallenge;