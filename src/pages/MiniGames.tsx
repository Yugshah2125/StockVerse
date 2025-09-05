import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gamepad2, 
  HelpCircle, 
  Zap, 
  Trophy, 
  Star, 
  Target,
  Gift,
  Timer,
  CheckCircle,
  RotateCcw
} from "lucide-react";

const MiniGames = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [dailyQuizCompleted, setDailyQuizCompleted] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: "Which stock gained the most today?",
      options: ["AAPL", "TSLA", "GOOGL", "MSFT"],
      correct: 1,
      reward: "500 XP"
    },
    {
      id: 2, 
      question: "What does P/E ratio stand for?",
      options: ["Price/Earnings", "Profit/Expense", "Price/Equity", "Performance/Efficiency"],
      correct: 0,
      reward: "750 XP"
    },
    {
      id: 3,
      question: "Which sector performed best this week?",
      options: ["Technology", "Healthcare", "Energy", "Finance"],
      correct: 2,
      reward: "1000 XP"
    }
  ];

  const wheelSegments = [
    { label: "Market Crash", effect: "-5% Portfolio", color: "text-loss", bg: "bg-loss/10" },
    { label: "Bull Run", effect: "+10% Portfolio", color: "text-profit", bg: "bg-profit/10" },
    { label: "Tech Boom", effect: "+15% Tech Stocks", color: "text-primary", bg: "bg-primary/10" },
    { label: "Rate Cut", effect: "+8% All Stocks", color: "text-profit", bg: "bg-profit/10" },
    { label: "Earnings Miss", effect: "-3% Random Stock", color: "text-loss", bg: "bg-loss/10" },
    { label: "Dividend Bonus", effect: "+$2,000 Cash", color: "text-gold", bg: "bg-gold/10" },
  ];

  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    const question = quizQuestions.find(q => q.id === questionId);
    if (question && answerIndex === question.correct) {
      // Correct answer logic
      setSelectedQuiz(null);
    }
  };

  const handleWheelSpin = () => {
    setWheelSpinning(true);
    setTimeout(() => {
      setWheelSpinning(false);
      // Random result logic here
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 lg:pl-78">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-gold" />
            Mini-Games
          </h1>
          <p className="text-muted-foreground">Play quick games and earn rewards while learning</p>
        </div>

        {/* Daily Progress */}
        <Card className="bg-gradient-to-r from-gold/10 via-card to-card-hover border-gold/30 animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-gold" />
                <div>
                  <CardTitle>Daily Challenge Progress</CardTitle>
                  <CardDescription>Complete games to earn bonus rewards</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="gap-1 text-gold border-gold/30">
                <Timer className="w-3 h-3" />
                Resets in 14h
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Daily Games Completed</span>
                <span className="font-bold">2 / 5</span>
              </div>
              <Progress value={40} className="h-3" />
              <div className="flex items-center gap-2 text-sm">
                <Gift className="w-4 h-4 text-gold" />
                <span className="text-muted-foreground">Complete 3 more for</span>
                <Badge variant="outline" className="text-gold border-gold/30">+5,000 XP Bonus</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Quiz Mode */}
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20 animate-slide-up hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Market Quiz</CardTitle>
                    <CardDescription>Test your trading knowledge</CardDescription>
                  </div>
                </div>
                {dailyQuizCompleted ? (
                  <Badge variant="outline" className="gap-1 text-profit border-profit/30">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="w-3 h-3" />
                    3 Questions
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedQuiz === null ? (
                <>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-gold">1,500 XP</p>
                        <p className="text-xs text-muted-foreground">Possible reward</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-primary">3 mins</p>
                        <p className="text-xs text-muted-foreground">Time limit</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-profit">Easy</p>
                        <p className="text-xs text-muted-foreground">Difficulty</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Today's Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Stock Performance</Badge>
                        <Badge variant="outline">Financial Ratios</Badge>
                        <Badge variant="outline">Market Sectors</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {!dailyQuizCompleted ? (
                    <Button 
                      variant="gaming" 
                      className="w-full" 
                      onClick={() => setSelectedQuiz(1)}
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Quiz Completed Today
                    </Button>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Question {selectedQuiz}/3</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Timer className="w-3 h-3" />
                      2:34
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      {quizQuestions[selectedQuiz - 1]?.question}
                    </h3>
                    
                    <div className="space-y-2">
                      {quizQuestions[selectedQuiz - 1]?.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start hover:border-primary/50"
                          onClick={() => handleQuizAnswer(selectedQuiz, index)}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedQuiz(null)}
                    className="w-full"
                  >
                    Back to Menu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spin the Wheel */}
          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20 animate-slide-up hover:shadow-xl hover:shadow-gold/20 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-gold to-yellow-400 flex items-center justify-center ${
                    wheelSpinning ? 'animate-spin-wheel' : ''
                  }`}>
                    <Target className="w-6 h-6 text-gold-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">News Wheel</CardTitle>
                    <CardDescription>Spin for market events</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Zap className="w-3 h-3" />
                  1 Free Spin
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm font-medium">Possible Events:</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {wheelSegments.map((segment, index) => (
                    <div key={index} className={`p-2 rounded ${segment.bg} border border-border/20`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{segment.label}</span>
                        <span className={`text-xs font-bold ${segment.color}`}>
                          {segment.effect}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {wheelSpinning ? (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-gold to-yellow-400 flex items-center justify-center animate-spin-wheel">
                    <Target className="w-8 h-8 text-gold-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Spinning...</p>
                </div>
              ) : (
                <Button 
                  variant="gold" 
                  className="w-full" 
                  onClick={handleWheelSpin}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Spin the Wheel
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Rewards */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Gift className="w-6 h-6 text-profit" />
              Recent Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Market Quiz Completed</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-gold border-gold/30">+1,250 XP</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gold" />
                  <div>
                    <p className="font-medium">Bull Run Event</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-profit border-profit/30">+10% Portfolio</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-gold" />
                  <div>
                    <p className="font-medium">Daily Challenge Bonus</p>
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-gold border-gold/30">+5,000 XP</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MiniGames;