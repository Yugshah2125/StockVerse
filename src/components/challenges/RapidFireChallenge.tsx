import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock, Trophy, Target, ChevronRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResult, setShowResult] = useState(false);

  const totalQuestions = 10;

  useEffect(() => {
    const shuffled = [...rapidFireData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestion + 1 >= totalQuestions) {
      setGameState('finished');
    } else {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(10);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestion, totalQuestions]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      setShowResult(true);
    }
  }, [timeLeft, gameState, selectedAnswer]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    if (answerIndex === questions[currentQuestion]?.correct) {
      setScore(prev => prev + 1);
    }
  };

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>;
  }

  if (gameState === 'finished') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-orange-500 mb-4" />
          <CardTitle className="text-3xl">Challenge Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-4xl font-bold">{score}/{totalQuestions}</div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setTimeLeft(10);
              setGameState('playing');
              setSelectedAnswer(null);
              setShowResult(false);
              const shuffled = [...rapidFireData].sort(() => Math.random() - 0.5);
              setQuestions(shuffled.slice(0, totalQuestions));
            }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button variant="outline" onClick={onBack}>Back to Hub</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-600">Rapid Fire Challenge</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span>{currentQuestion + 1} of {totalQuestions}</span>
            <Badge variant={timeLeft <= 3 ? "destructive" : "secondary"}>{timeLeft}s</Badge>
          </div>
          <Progress value={((currentQuestion + 1) / totalQuestions) * 100} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{currentQ?.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ?.options.map((option, index) => {
            const isCorrect = showResult && index === currentQ.correct;
            const isSelected = selectedAnswer === index;
            const isWrong = showResult && isSelected && index !== currentQ.correct;
            
            return (
              <Button
                key={index}
                variant="outline"
                className={`w-full p-4 text-left justify-start ${
                  isCorrect ? "bg-green-500 text-white" :
                  isWrong ? "bg-red-500 text-white" :
                  isSelected ? "bg-orange-500 text-white" : ""
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {String.fromCharCode(65 + index)}. {option}
                {showResult && isCorrect && <CheckCircle className="w-4 h-4 ml-auto" />}
                {showResult && isWrong && <XCircle className="w-4 h-4 ml-auto" />}
              </Button>
            );
          })}
          
          {showResult && (
            <>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm">{currentQ?.explanation}</p>
              </div>
              <div className="flex justify-center">
                <Button onClick={nextQuestion} className="bg-orange-500">
                  {currentQuestion + 1 >= totalQuestions ? 'View Results' : 'Next Question'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RapidFireChallenge;