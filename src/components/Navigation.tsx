import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Trophy, 
  Zap, 
  Gamepad2, 
  Users, 
  User,
  ChartBar,
  Menu,
  X,
  TrendingUp,
  LogOut
} from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      description: "Overview & stats"
    },
    { 
      path: "/portfolio", 
      label: "Portfolio", 
      icon: ChartBar,
      description: "Your holdings",
      badge: "+2.4%"
    },
    { 
      path: "/fantasy-league", 
      label: "Fantasy League", 
      icon: Trophy,
      description: "Draft & compete",
      badge: "Active"
    },
    { 
      path: "/trading-challenge", 
      label: "Trading Challenge", 
      icon: Zap,
      description: "Level up skills",
      badge: "60%"
    },
    { 
      path: "/mini-games", 
      label: "Mini-Games", 
      icon: Gamepad2,
      description: "Quick rewards"
    },
    { 
      path: "/leaderboard", 
      label: "Leaderboard", 
      icon: Users,
      description: "Global rankings",
      badge: "#847"
    },
    { 
      path: "/profile", 
      label: "Profile", 
      icon: User,
      description: "Account & badges"
    }
  ];

  const handleSignOut = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="card"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-card border-r border-border z-40">
        <div className="flex flex-col w-full p-6">
          
          {/* Logo */}
          <div className="mb-8">
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center group-hover:animate-glow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">StockVerse</h1>
                <p className="text-xs text-muted-foreground">Virtual Trading Platform</p>
              </div>
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-md shadow-primary/10"
                        : "hover:bg-card-hover text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    <p className="text-xs opacity-75 truncate">{item.description}</p>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-gradient-to-r from-gold/5 to-gold/10 border-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-yellow-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">Level {user?.level || 1} • Trader</p>
                </div>
              </div>
            </Card>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-loss"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <aside className={`
        lg:hidden fixed left-0 top-0 h-screen w-72 bg-card border-r border-border z-50 transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col w-full p-6 pt-16">
          
          {/* Logo */}
          <div className="mb-8">
            <NavLink 
              to="/dashboard" 
              className="flex items-center gap-3 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center group-hover:animate-glow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">StockVerse</h1>
                <p className="text-xs text-muted-foreground">Virtual Trading Platform</p>
              </div>
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-md shadow-primary/10"
                        : "hover:bg-card-hover text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    <p className="text-xs opacity-75 truncate">{item.description}</p>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-gradient-to-r from-gold/5 to-gold/10 border-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-yellow-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">Level {user?.level || 1} • Trader</p>
                </div>
              </div>
            </Card>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-loss"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;