import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Scale, Trophy, ArrowLeft, Lightbulb, CheckCircle, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import tradingPsychologyData from "@/data/tradingPsychologyData.json";

interface TradingPsychologyChallengeProps {
  onBack: () => void;
}

interface Question {
  id: number;
  scenario: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const TradingPsychologyChallenge = ({ onBack }: TradingPsychologyChallengeProps) => {
  const { updateUserXP } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [xpAwarded, setXpAwarded] = useState(false);

  const totalQuestions = 10;

  useEffect(() => {
    const shuffled = [...tradingPsychologyData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      // Award XP when challenge is completed
      if (!xpAwarded) {
        const xpGain = score * 50; // 50 XP per correct answer
        updateUserXP(xpGain);
        setXpAwarded(true);
      }
    }
  };

  const handleRestart = () => {
    const shuffled = [...tradingPsychologyData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
    setXpAwarded(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return { message: "🧠 Psychology Master!", color: "text-teal-700", desc: "You have excellent emotional control and decision-making skills!" };
    if (percentage >= 70) return { message: "🎯 Well-Balanced Trader!", color: "text-cyan-700", desc: "You show good awareness of trading psychology principles!" };
    if (percentage >= 50) return { message: "📈 Growing Awareness!", color: "text-blue-700", desc: "You're developing good psychological habits for trading!" };
    return { message: "🌱 Learning Journey!", color: "text-slate-700", desc: "Keep practicing mindful trading - awareness is the first step!" };
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (gameComplete) {
    const { message, color, desc } = getScoreMessage();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >


        <Card className="bg-gradient-to-br from-teal-50/80 to-cyan-50/80 border-teal-200/60 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
              Psychology Challenge Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
              >
                {score}/{totalQuestions}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <p className={`text-2xl font-semibold ${color}`}>{message}</p>
                <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">{desc}</p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="text-left bg-gradient-to-br from-white/60 to-teal-50/40 border border-teal-200/50 rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center shadow-sm">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    Key Psychology Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Brain, text: "Emotional awareness prevents impulsive trading decisions" },
                    { icon: Scale, text: "Balance confidence with humility to avoid overtrading" },
                    { icon: Heart, text: "Manage fear and greed through disciplined risk management" },
                    { icon: CheckCircle, text: "Stick to your trading plan regardless of emotions" }
                  ].map((tip, index) => {
                    const Icon = tip.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/40 border border-teal-100/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-teal-700" />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700">{tip.text}</p>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  onClick={handleRestart} 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Practice Again
                </Button>
              </motion.div>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onBack}
                className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-colors duration-200"
              >
                Back to Hub
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >


      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
          Trading Psychology Challenge
        </h1>
        <p className="text-slate-600">Master your emotions, master your trades</p>
      </div>

      {/* Progress */}
      <Card className="bg-gradient-to-r from-teal-50/70 to-cyan-50/70 border-teal-200/60 shadow-md backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-700" />
              <span className="font-semibold text-slate-800">{currentQuestion + 1} of {totalQuestions}</span>
            </div>
            <Badge variant="secondary" className="bg-teal-100/80 text-teal-800 border-teal-200/50">
              {currentQ?.category}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-slate-600">
              <span>{Math.round(progress)}% Complete</span>
              <span>Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border border-teal-200/60 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0 mt-1 border border-teal-200/50">
                  <Heart className="w-6 h-6 text-teal-700" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-slate-800 leading-relaxed">
                    {currentQ?.scenario}
                  </CardTitle>
                </div>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {currentQ?.options.map((option, index) => {
                  const isCorrect = showResult && index === currentQ.correct;
                  const isSelected = selectedAnswer === index;
                  const isWrong = showResult && isSelected && index !== currentQ.correct;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full h-auto p-4 text-left justify-start rounded-xl shadow-sm transition-all duration-300 ${
                          isCorrect
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-emerald-500/25"
                            : isWrong
                            ? "bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400 shadow-rose-500/25"
                            : isSelected && !showResult
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-400 shadow-teal-500/30"
                            : selectedAnswer === null
                            ? "hover:bg-teal-50/70 hover:border-teal-300/60 hover:shadow-md bg-white/80 border-slate-200 text-slate-800 hover:text-slate-900"
                            : "opacity-60 bg-white/40 text-slate-600"
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            isCorrect || isWrong
                              ? "bg-white/25"
                              : isSelected && !showResult
                              ? "bg-white/25"
                              : "bg-slate-100/80"
                          }`}>
                            {showResult && (isCorrect || isWrong) ? (
                              isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                            ) : (
                              <span className={`font-bold text-sm ${
                                isCorrect || isWrong || (isSelected && !showResult)
                                  ? "text-white"
                                  : "text-slate-700"
                              }`}>{String.fromCharCode(65 + index)}</span>
                            )}
                          </div>
                          <span className={`font-medium leading-relaxed flex-1 ${
                            isCorrect || isWrong || (isSelected && !showResult) 
                              ? "text-white" 
                              : "text-slate-800"
                          }`}>{option}</span>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
              
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-6 p-4 bg-gradient-to-r from-cyan-50/80 to-teal-50/80 border border-cyan-200/60 rounded-xl shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-teal-800 mb-2">
                        {selectedAnswer === currentQ.correct ? "🎯 Excellent Choice!" : "💡 Learning Moment"}
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{currentQ?.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="flex justify-center pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {!showResult ? (
                    <Button
                      size="lg"
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 transition-all duration-300 px-8"
                    >
                      <Scale className="w-5 h-5 mr-2" />
                      Submit Choice
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleNextQuestion}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 px-8"
                    >
                      {currentQuestion + 1 >= totalQuestions ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          View Results
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 mr-2" />
                          Next Scenario
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default TradingPsychologyChallenge;