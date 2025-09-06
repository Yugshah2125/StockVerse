import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock, Zap, Trophy, ArrowLeft, Target, ChevronRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import rapidFireData from "@/data/rapidFireData.json";

interface RapidFireChallengeProps {
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const RapidFireChallenge = ({ onBack }: RapidFireChallengeProps) => {
  const { updateUserXP } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const totalQuestions = 10;

  useEffect(() => {
    const shuffled = [...rapidFireData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
  }, []);

  const nextQuestion = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        setGameState('finished');
        // Award XP when challenge is completed
        if (!xpAwarded) {
          const xpGain = score * 30; // 30 XP per correct answer
          updateUserXP(xpGain);
          setXpAwarded(true);
        }
      } else {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(10);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsTransitioning(false);
      }
    }, 300);
  }, [currentQuestion, totalQuestions]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      setShowResult(true);
    }
  }, [timeLeft, gameState, selectedAnswer, nextQuestion]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion]?.correct) {
      setScore(prev => prev + 1);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return { message: "🔥 Fire Master!", color: "text-orange-500" };
    if (percentage >= 70) return { message: "🌟 Blazing Hot!", color: "text-yellow-500" };
    if (percentage >= 50) return { message: "⚡ Getting Warmer!", color: "text-blue-500" };
    return { message: "❄️ Keep Practicing!", color: "text-gray-500" };
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const { message, color } = getScoreMessage();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >


        <Card className="bg-gradient-to-br from-orange-50/80 to-red-50/80 border-orange-200/60 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
              Challenge Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
              >
                {score}/{totalQuestions}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-2xl font-semibold ${color}`}
              >
                {message}
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score / totalQuestions) * 100}%` }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full mx-auto max-w-md shadow-lg"
                style={{
                  boxShadow: '0 0 20px rgba(251, 146, 60, 0.6)'
                }}
              />
            </div>
            
            <div className="flex gap-4 justify-center">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                >
                  <p className="text-sm font-semibold text-green-800 mb-1">Challenge Reward</p>
                  <p className="text-lg font-bold text-green-600">+{score * 20} XP Earned!</p>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScore(0);
                      setTimeLeft(10);
                      setGameState('playing');
                      setSelectedAnswer(null);
                      setShowResult(false);
                      setIsTransitioning(false);
                      setXpAwarded(false);
                      const shuffled = [...rapidFireData].sort(() => Math.random() - 0.5);
                      setQuestions(shuffled.slice(0, totalQuestions));
                    }} 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry Challenge
                  </Button>
                </motion.div>
              </div>
              <Button 
                variant="outline" 
                onClick={onBack}
                className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-colors duration-200"
              >
                Back to Hub
              </Button>
            </div>
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
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center shadow-lg"
        >
          <Flame className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Rapid Fire Challenge
        </h1>
      </div>

      {/* Progress and Timer */}
      <Card className="bg-gradient-to-r from-orange-50/70 to-red-50/70 border-orange-200/60 shadow-md backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-slate-800">{currentQuestion + 1} of {totalQuestions}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              <Badge 
                variant={timeLeft <= 3 ? "destructive" : "secondary"}
                className={timeLeft <= 3 ? "animate-pulse" : ""}
              >
                {timeLeft}s
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <motion.div
              key={`timer-${currentQuestion}`}
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 10) * 100}%` }}
              transition={{ duration: 0.1 }}
              className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full shadow-lg"
              style={{
                boxShadow: timeLeft <= 3 ? '0 0 10px rgba(251, 146, 60, 0.8)' : '0 0 5px rgba(251, 146, 60, 0.4)'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Card className="border border-orange-200/60 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0 mt-1 border border-orange-200/50">
                    <Flame className="w-6 h-6 text-orange-700" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-slate-800 leading-relaxed">{currentQ?.question}</CardTitle>
                  </div>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400 shadow-emerald-500/25"
                            : isWrong
                            ? "bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400 shadow-rose-500/25"
                            : isSelected && !showResult
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400 shadow-orange-500/30"
                            : selectedAnswer === null
                            ? "hover:bg-orange-50/70 hover:border-orange-300/60 hover:shadow-md bg-white/80 border-slate-200 text-slate-800 hover:text-slate-900"
                            : "opacity-60 bg-white/40 text-slate-600"
                        }`}
                        onClick={() => handleAnswer(index)}
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
                
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-6 p-4 bg-gradient-to-r from-orange-50/80 to-red-50/80 border border-orange-200/60 rounded-xl shadow-sm backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-800 mb-2">
                          {selectedAnswer === currentQ.correct ? "🔥 Blazing Fast!" : "⚡ Quick Learning"}
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">{currentQ?.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center pt-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={nextQuestion}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 px-8"
                      >
                        {currentQuestion + 1 >= totalQuestions ? 'View Results' : 'Next Question'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 via-red-100 to-yellow-100 rounded-full shadow-lg border border-orange-200">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-5 h-5 text-orange-600" />
          </motion.div>
          <span className="font-bold text-orange-800 text-lg">Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RapidFireChallenge;