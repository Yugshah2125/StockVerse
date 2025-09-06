import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  ArrowUpDown,
  DollarSign
} from "lucide-react";

interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
  pnl?: number;
}

const TransactionsReports = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterSymbol, setFilterSymbol] = useState("");
  const [filterType, setFilterType] = useState("");

  // Fetch real transaction data
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { firebaseApi } = await import('@/services/firebaseApi');
        const trades = await firebaseApi.getTradeHistory(user.id);
        
        console.log('Fetched trades:', trades); // Debug log
        
        const formattedTransactions: Transaction[] = trades.map((trade: any) => ({
          id: trade.id,
          symbol: trade.symbol,
          type: trade.type as 'buy' | 'sell',
          shares: trade.shares,
          price: trade.price,
          total: trade.total,
          timestamp: trade.timestamp,
          pnl: trade.pnl || 0
        }));
        
        console.log('Formatted transactions:', formattedTransactions); // Debug log
        
        setTransactions(formattedTransactions);
        setFilteredTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    if (dateFrom) {
      filtered = filtered.filter(t => t.timestamp >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(t => t.timestamp <= new Date(dateTo));
    }
    if (filterSymbol) {
      filtered = filtered.filter(t => t.symbol.toLowerCase().includes(filterSymbol.toLowerCase()));
    }
    if (filterType) {
      filtered = filtered.filter(t => t.type === filterType);
    }

    setFilteredTransactions(filtered);
  }, [transactions, dateFrom, dateTo, filterSymbol, filterType]);

  // Calculate summary statistics
  const totalBought = filteredTransactions.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.total, 0);
  const totalSold = filteredTransactions.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.total, 0);
  const totalPnL = filteredTransactions.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalTransactions = filteredTransactions.length;

  // Export functions
  const exportToCSV = () => {
    const headers = ['Date', 'Symbol', 'Type', 'Shares', 'Price', 'Total', 'P&L'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.timestamp.toLocaleDateString(),
        t.symbol,
        t.type.toUpperCase(),
        t.shares,
        t.price,
        t.total,
        t.pnl || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${dateFrom || 'all'}_to_${dateTo || 'now'}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    // Simple PDF export (in real app, use jsPDF or similar)
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Transactions & Reports
          </h1>
          <p className="text-muted-foreground">Track your trading history and analyze performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card-hover border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-profit/5 via-card to-card-hover border-profit/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-profit" />
                Total Bought
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-profit">₭{totalBought.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-loss/5 via-card to-card-hover border-loss/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-loss" />
                Total Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-loss">₭{totalSold.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold/5 via-card to-card-hover border-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold" />
                Total P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalPnL >= 0 ? '+' : ''}₭{totalPnL.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Export */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g. RELIANCE"
                  value={filterSymbol}
                  onChange={(e) => setFilterSymbol(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Types</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={exportToCSV} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
                <Button onClick={exportToPDF} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="transactions" className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="reports">Detailed Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          </TabsList>

          {/* Transaction History */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Symbol</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-right p-2">Shares</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Total</th>
                        <th className="text-right p-2">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{transaction.timestamp.toLocaleDateString()}</td>
                          <td className="p-2 font-medium">{transaction.symbol}</td>
                          <td className="p-2">
                            <Badge variant={transaction.type === 'buy' ? 'default' : 'secondary'}>
                              {transaction.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-2 text-right">{transaction.shares}</td>
                          <td className="p-2 text-right">₭{transaction.price.toFixed(2)}</td>
                          <td className="p-2 text-right">₭{transaction.total.toLocaleString()}</td>
                          <td className={`p-2 text-right font-medium ${
                            transaction.pnl ? (transaction.pnl >= 0 ? 'text-profit' : 'text-loss') : 'text-muted-foreground'
                          }`}>
                            {transaction.pnl ? `₭${transaction.pnl.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Reports */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock-wise Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(filteredTransactions.map(t => t.symbol))).map(symbol => {
                      const symbolTransactions = filteredTransactions.filter(t => t.symbol === symbol);
                      const bought = symbolTransactions.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.shares, 0);
                      const sold = symbolTransactions.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.shares, 0);
                      const held = bought - sold;
                      const pnl = symbolTransactions.reduce((sum, t) => sum + (t.pnl || 0), 0);

                      return (
                        <div key={symbol} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">{symbol}</h4>
                            <Badge variant={pnl >= 0 ? 'default' : 'destructive'}>
                              {pnl >= 0 ? '+' : ''}₭{pnl.toFixed(2)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Bought</p>
                              <p className="font-medium">{bought}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sold</p>
                              <p className="font-medium">{sold}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Held</p>
                              <p className="font-medium">{held}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Monthly breakdown charts coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Dashboard */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profit Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Profit trend charts coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <PieChart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Portfolio distribution charts coming soon</p>
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

export default TransactionsReports;