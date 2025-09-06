import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/hooks/useTrading";
import { Link } from "react-router-dom";
import { 
  GraduationCap,
  PiggyBank,
  Target,
  TrendingUp,
  Shield,
  BookOpen,
  Trophy,
  Lightbulb,
  Calculator,
  DollarSign,
  AlertCircle,
  CheckCircle,
  PieChart,
  Medal,
  Crown
} from "lucide-react";

interface BudgetData {
  income: number;
  expenses: number;
  savingsGoal: number;
  emergencyFund: number;
  investments: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: any;
}

const FinancialEducation = () => {
  const { user } = useAuth();
  const { data: portfolio } = usePortfolio();
  const [budget, setBudget] = useState<BudgetData>({
    income: 0,
    expenses: 0,
    savingsGoal: 0,
    emergencyFund: 0,
    investments: 0
  });
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const lessons = [
    {
      title: "Stock Market Fundamentals",
      content: "Learn how stock markets work, market hours, order types (market, limit, stop-loss), and how to read stock quotes. Understanding bid-ask spreads and volume is crucial for successful trading.",
      tip: "Always use limit orders as a beginner to control your entry and exit prices."
    },
    {
      title: "Technical Analysis Basics",
      content: "Chart patterns, support/resistance levels, moving averages, and key indicators like RSI and MACD help predict price movements. Technical analysis is essential for timing your trades.",
      tip: "Start with simple moving averages (20, 50, 200-day) to identify trends."
    },
    {
      title: "Risk Management",
      content: "Never risk more than 2% of your portfolio on a single trade. Use stop-losses, position sizing, and diversification to protect your capital. Risk management is more important than picking winners.",
      tip: "Set your stop-loss before entering any trade. Stick to your plan."
    },
    {
      title: "Portfolio Construction",
      content: "Build a balanced portfolio across sectors, market caps, and asset classes. Include growth stocks, value stocks, dividend stocks, and index funds based on your risk tolerance and goals.",
      tip: "Start with 60% large-cap, 30% mid-cap, 10% small-cap allocation."
    },
    {
      title: "Market Psychology",
      content: "Understand fear and greed cycles, market sentiment indicators, and how emotions affect trading decisions. Successful traders control their emotions and stick to their strategy.",
      tip: "When everyone is fearful, be greedy. When everyone is greedy, be fearful."
    },
    {
      title: "Indian Market Specifics",
      content: "Learn about NSE/BSE, trading hours (9:15 AM - 3:30 PM), settlement cycles, taxation on gains, and key indices like NIFTY 50, SENSEX, and sector-specific indices.",
      tip: "Focus on NIFTY 50 stocks initially - they're liquid and less volatile."
    }
  ];

  // Calculate budget allocations
  const availableForSavings = budget.income - budget.expenses;
  const recommendedEmergency = budget.expenses * 6; // 6 months of expenses
  const budgetHealth = availableForSavings > 0 ? 'good' : 'poor';

  // Generate dynamic achievements based on user progress
  useEffect(() => {
    const userLevel = user?.level || 1;
    const holdingsCount = portfolio?.holdings?.length || 0;
    
    const portfolioValue = portfolio?.totalValue || 0;
    const totalReturn = portfolio?.totalReturn || 0;
    
    const dynamicAchievements = [
      {
        id: '1',
        title: 'First Trade',
        description: 'Execute your first stock trade',
        completed: holdingsCount > 0,
        icon: TrendingUp
      },
      {
        id: '2',
        title: 'Risk Manager',
        description: 'Use position calculator with proper risk %',
        completed: budget.expenses > 0 && budget.expenses <= 2,
        icon: Shield
      },
      {
        id: '3',
        title: 'Portfolio Builder',
        description: 'Hold 3+ different stocks',
        completed: holdingsCount >= 3,
        icon: Target
      },
      {
        id: '4',
        title: 'Learning Enthusiast',
        description: 'Complete all trading lessons',
        completed: currentLesson >= lessons.length - 1,
        icon: BookOpen
      },
      {
        id: '5',
        title: 'Profit Maker',
        description: 'Achieve positive returns',
        completed: totalReturn > 0,
        icon: DollarSign
      },
      {
        id: '6',
        title: 'Big Investor',
        description: 'Portfolio value over ₹50,00,000',
        completed: portfolioValue >= 5000000,
        icon: Trophy
      },
      {
        id: '7',
        title: 'Diversification Master',
        description: 'Hold 5+ different stocks',
        completed: holdingsCount >= 5,
        icon: PieChart
      },
      {
        id: '8',
        title: 'Level Up Champion',
        description: 'Reach level 5',
        completed: userLevel >= 5,
        icon: Medal
      },
      {
        id: '9',
        title: 'High Roller',
        description: 'Portfolio value over ₹1,00,00,000',
        completed: portfolioValue >= 10000000,
        icon: Crown
      },
      {
        id: '10',
        title: 'Trading Veteran',
        description: 'Hold 10+ different stocks',
        completed: holdingsCount >= 10,
        icon: Medal
      }
    ];
    
    setAchievements(dynamicAchievements);
  }, [budget, currentLesson, user, portfolio, lessons.length]);

  const handleBudgetChange = (field: keyof BudgetData, value: number) => {
    setBudget(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            Trading Academy
          </h1>
          <p className="text-muted-foreground">Master trading strategies and become a successful investor</p>
        </div>

        {/* Achievements */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(showAllAchievements ? achievements : achievements.slice(0, 3)).map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className={`p-4 rounded-lg border ${
                    achievement.completed ? 'bg-profit/10 border-profit/20' : 'bg-muted/30 border-border'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-6 h-6 ${achievement.completed ? 'text-profit' : 'text-muted-foreground'}`} />
                      <h3 className="font-semibold">{achievement.title}</h3>
                      {achievement.completed && <CheckCircle className="w-5 h-5 text-profit" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                );
              })}
            </div>
            {achievements.length > 3 && (
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllAchievements(!showAllAchievements)}
                >
                  {showAllAchievements ? 'See Less' : `See More (${achievements.length - 3})`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="calculator" className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">Trading Calculator</TabsTrigger>
            <TabsTrigger value="lessons">Trading Lessons</TabsTrigger>
            <TabsTrigger value="simulation">Paper Trading</TabsTrigger>
            <TabsTrigger value="guidance">Trading Tips</TabsTrigger>
          </TabsList>

          {/* Trading Calculator */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Position Size Calculator
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setBudget({ income: 0, expenses: 0, savingsGoal: 0, emergencyFund: 0, investments: 0 })}
                    >
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="income">Portfolio Value (₹)</Label>
                    <Input
                      id="income"
                      type="number"
                      value={budget.income || ''}
                      onChange={(e) => handleBudgetChange('income', Number(e.target.value))}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expenses">Risk Per Trade (%)</Label>
                    <Input
                      id="expenses"
                      type="number"
                      value={budget.expenses || ''}
                      onChange={(e) => handleBudgetChange('expenses', Number(e.target.value))}
                      placeholder="2"
                      max="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="savingsGoal">Entry Price (₹)</Label>
                    <Input
                      id="savingsGoal"
                      type="number"
                      value={budget.savingsGoal || ''}
                      onChange={(e) => handleBudgetChange('savingsGoal', Number(e.target.value))}
                      placeholder="1500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyFund">Stop Loss (₹)</Label>
                    <Input
                      id="emergencyFund"
                      type="number"
                      value={budget.emergencyFund || ''}
                      onChange={(e) => handleBudgetChange('emergencyFund', Number(e.target.value))}
                      placeholder="1450"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Risk Amount:</span>
                      <span className="font-bold text-loss">
                        ₹{((budget.income * budget.expenses) / 100).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Position Size:</span>
                      <span className="font-bold text-primary">
                        {budget.savingsGoal && budget.emergencyFund && budget.savingsGoal > budget.emergencyFund
                          ? Math.floor(((budget.income * budget.expenses) / 100) / (budget.savingsGoal - budget.emergencyFund))
                          : 0
                        } shares
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Total Investment:</span>
                      <span className="font-bold text-profit">
                        ₹{(budget.savingsGoal * (budget.savingsGoal && budget.emergencyFund && budget.savingsGoal > budget.emergencyFund
                          ? Math.floor(((budget.income * budget.expenses) / 100) / (budget.savingsGoal - budget.emergencyFund))
                          : 0)).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Calculator className="w-4 h-4 text-primary" />
                        <span className="font-medium">Risk-Reward Ratio</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Risk: ₹{budget.savingsGoal && budget.emergencyFund ? (budget.savingsGoal - budget.emergencyFund).toFixed(2) : '0'} per share
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max Loss: ₹{((budget.income * budget.expenses) / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investment Lessons */}
          <TabsContent value="lessons">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Module {currentLesson + 1}: {lessons[currentLesson].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed">{lessons[currentLesson].content}</p>
                  
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Pro Tip</span>
                    </div>
                    <p className="text-sm">{lessons[currentLesson].tip}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                      disabled={currentLesson === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentLesson + 1} of {lessons.length}
                    </span>
                    <Button 
                      onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
                      disabled={currentLesson === lessons.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lesson Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          index === currentLesson ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                        }`}
                        onClick={() => setCurrentLesson(index)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index <= currentLesson ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{lesson.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Practice Mode */}
          <TabsContent value="simulation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Investment Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Paper Trading</h3>
                  <p className="text-muted-foreground mb-6">
                    Practice trading strategies with virtual money before risking real capital!
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-semibold mb-1">Swing Trading</h4>
                        <p className="text-sm text-muted-foreground">Hold 2-10 days, medium risk</p>
                      </div>
                      <div className="p-4 bg-gold/10 rounded-lg">
                        <h4 className="font-semibold mb-1">Day Trading</h4>
                        <p className="text-sm text-muted-foreground">Intraday, high frequency</p>
                      </div>
                      <div className="p-4 bg-profit/10 rounded-lg">
                        <h4 className="font-semibold mb-1">Position Trading</h4>
                        <p className="text-sm text-muted-foreground">Long-term, low frequency</p>
                      </div>
                    </div>
                    <Button className="gap-2" asChild>
                      <Link to="/dashboard">
                        <TrendingUp className="w-4 h-4" />
                        Start Paper Trading
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Guidance */}
          <TabsContent value="guidance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Risk Management Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span>Risk Per Trade</span>
                      <Badge variant="destructive">Max 2% of capital</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span>Position Size</span>
                      <Badge variant="secondary">Based on stop-loss</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span>Diversification</span>
                      <Badge variant="default">Max 5% per stock</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span>Cash Reserve</span>
                      <Badge variant="secondary">20-30% for opportunities</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Personalized Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableForSavings > 0 ? (
                    <div className="p-4 bg-profit/10 rounded-lg">
                      <h4 className="font-semibold text-profit mb-2">{portfolio?.holdings?.length >= 3 ? 'Advanced Trader!' : 'Good start!'}</h4>
                      <p className="text-sm">{portfolio?.holdings?.length >= 3 ? 'Your portfolio is diversified. Consider:' : 'Keep building your portfolio:'}</p>
                      <ul className="text-sm mt-2 space-y-1">
                        {portfolio?.holdings?.length >= 3 ? (
                          <>
                            <li>• Monitor sector allocation</li>
                            <li>• Set trailing stop-losses</li>
                            <li>• Review quarterly earnings</li>
                          </>
                        ) : (
                          <>
                            <li>• Add more stocks for diversification</li>
                            <li>• Focus on different sectors</li>
                            <li>• Start with blue-chip stocks</li>
                          </>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 bg-loss/10 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">{portfolio?.holdings?.length === 0 ? 'Ready to start?' : 'Need improvement'}</h4>
                      <p className="text-sm">{portfolio?.holdings?.length === 0 ? 'Begin your trading journey:' : 'Optimize your strategy:'}</p>
                      <ul className="text-sm mt-2 space-y-1">
                        {portfolio?.holdings?.length === 0 ? (
                          <>
                            <li>• Complete trading lessons first</li>
                            <li>• Start with paper trading</li>
                            <li>• Learn risk management</li>
                          </>
                        ) : (
                          <>
                            <li>• Reduce position sizes</li>
                            <li>• Use proper stop-losses</li>
                            <li>• Diversify holdings</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Position Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {budget.expenses <= 2 ? 
                          <CheckCircle className="w-4 h-4 text-profit" /> : 
                          <AlertCircle className="w-4 h-4 text-loss" />
                        }
                        <span className="text-sm">Risk within 2% limit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {budget.savingsGoal && budget.emergencyFund && budget.savingsGoal > budget.emergencyFund ? 
                          <CheckCircle className="w-4 h-4 text-profit" /> : 
                          <AlertCircle className="w-4 h-4 text-loss" />
                        }
                        <span className="text-sm">Valid stop-loss set</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinancialEducation;