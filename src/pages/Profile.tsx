import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Basic Profile Info */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg">{user?.name || 'Not available'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{user?.email || 'Not available'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Level</label>
                <p className="text-lg">{user?.level || 1}</p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="w-4 h-4" />
                  <span>Full profile features require database configuration</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;