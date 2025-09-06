import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Gift, X } from "lucide-react";
import { LevelUpResult, getLevelTheme } from "@/utils/levelSystem";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelUpData: LevelUpResult;
}

const LevelUpModal = ({ isOpen, onClose, levelUpData }: LevelUpModalProps) => {
  const theme = getLevelTheme(levelUpData.newLevel);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className={`bg-gradient-to-br ${theme.bg} border-2 border-opacity-30 shadow-2xl ${theme.glow} relative overflow-hidden`}>
              {/* Confetti Animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -10, x: Math.random() * 400, opacity: 1 }}
                    animate={{ 
                      y: 400, 
                      x: Math.random() * 400,
                      rotate: Math.random() * 360,
                      opacity: 0 
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5 
                    }}
                    className={`absolute w-2 h-2 bg-gradient-to-r ${theme.gradient} rounded-full`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 z-10"
              >
                <X className="w-4 h-4" />
              </Button>

              <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", duration: 0.8 }}
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center shadow-lg ${theme.glow}`}
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <CardTitle className="text-3xl font-bold mb-2">
                    <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                      Level Up!
                    </span>
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Congratulations on reaching Level {levelUpData.newLevel}!
                  </p>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center space-y-2"
                >
                  <div className="flex items-center justify-center gap-4">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      Level {levelUpData.oldLevel}
                    </Badge>
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Zap className={`w-6 h-6 ${theme.accent}`} />
                    </motion.div>
                    <Badge className={`text-lg px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white`}>
                      Level {levelUpData.newLevel}
                    </Badge>
                  </div>
                  
                  {levelUpData.xpCarriedOver > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {levelUpData.xpCarriedOver} XP carried over to next level
                    </p>
                  )}
                </motion.div>

                {levelUpData.unlockedFeatures.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Gift className={`w-5 h-5 ${theme.accent}`} />
                      <h4 className="font-semibold">New Features Unlocked</h4>
                    </div>
                    
                    <div className="space-y-2">
                      {levelUpData.unlockedFeatures.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          className="flex items-center gap-2 justify-center"
                        >
                          <Star className={`w-4 h-4 ${theme.accent}`} />
                          <span className="text-sm font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="pt-4"
                >
                  <Button
                    onClick={onClose}
                    className={`w-full bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white font-semibold py-3 shadow-lg ${theme.glow} transition-all duration-300`}
                  >
                    Continue Trading
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;