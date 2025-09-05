import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, Trophy } from "lucide-react";

const TradingChallenge = () => {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-profit" />
            Trading Challenge
          </h1>
          <p className="text-muted-foreground">Complete levels and earn rewards</p>
        </div>

        {/* Empty State */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Challenge Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Challenges Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Trading challenges are not available yet. Start trading to unlock future challenges!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>Feature under development</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingChallenge;