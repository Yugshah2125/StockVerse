import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TradingTest = () => {
  const [shares, setShares] = useState('');
  const [result, setResult] = useState('');

  const testBuy = () => {
    const shareCount = parseInt(shares);
    if (shareCount > 0) {
      // Simulate buy
      const cost = shareCount * 100; // $100 per share
      setResult(`✅ Bought ${shareCount} shares for $${cost}`);
    } else {
      setResult('❌ Enter valid number of shares');
    }
  };

  const testSell = () => {
    const shareCount = parseInt(shares);
    if (shareCount > 0) {
      // Simulate sell
      const value = shareCount * 100; // $100 per share
      setResult(`✅ Sold ${shareCount} shares for $${value}`);
    } else {
      setResult('❌ Enter valid number of shares');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>🧪 Trading Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          placeholder="Number of shares"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={testBuy} className="flex-1">
            Test Buy
          </Button>
          <Button onClick={testSell} variant="destructive" className="flex-1">
            Test Sell
          </Button>
        </div>
        {result && (
          <div className="p-3 bg-muted rounded">
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingTest;