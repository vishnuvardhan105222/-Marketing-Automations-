import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Download, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  profileCompletions: number;
  chatbotLeads: number;
  formSubmissions: number;
  activeWorkflows: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    profileCompletions: 0,
    chatbotLeads: 0,
    formSubmissions: 0,
    activeWorkflows: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all dashboard statistics
      const [
        { count: totalUsers },
        { count: profileCompletions },
        { count: chatbotLeads },
        { count: formSubmissions },
        { count: activeWorkflows }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('profile_completed', true),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('source', 'chatbot'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('source', 'form'),
        supabase.from('workflow_steps').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        profileCompletions: profileCompletions || 0,
        chatbotLeads: chatbotLeads || 0,
        formSubmissions: formSubmissions || 0,
        activeWorkflows: activeWorkflows || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    // This would generate and download Excel report
    console.log('Downloading Excel report...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NxtWave Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={downloadReport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button onClick={signOut} variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completions</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileCompletions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? `${Math.round((stats.profileCompletions / stats.totalUsers) * 100)}%` : '0%'} completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chatbot Leads</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chatbotLeads}</div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
              <FileText className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.formSubmissions}</div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeWorkflows}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Lead Nurturing Performance
                  </CardTitle>
                  <CardDescription>
                    Omnichannel workflow effectiveness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Open Rate</span>
                      <Badge variant="secondary">85%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SMS Response Rate</span>
                      <Badge variant="secondary">72%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">WhatsApp Engagement</span>
                      <Badge variant="secondary">91%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">5 new form submissions</span>
                      <span className="text-muted-foreground block">2 minutes ago</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Workflow batch completed</span>
                      <span className="text-muted-foreground block">15 minutes ago</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">3 chatbot conversations</span>
                      <span className="text-muted-foreground block">1 hour ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflows">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>Omnichannel Lead Nurturing</CardTitle>
                <CardDescription>
                  Manage and monitor your automated nurturing workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Workflow management interface coming soon...</p>
                  <Button className="mt-4 bg-[var(--gradient-primary)]">
                    Configure Workflows
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chatbot">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>SwiftSell Chatbot Integration</CardTitle>
                <CardDescription>
                  Lead qualification and webinar registration chatbot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chatbot configuration interface coming soon...</p>
                  <Button className="mt-4 bg-[var(--gradient-primary)]">
                    Configure Chatbot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>Form Submission Handler</CardTitle>
                <CardDescription>
                  Manage form submissions and automation triggers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Form management interface coming soon...</p>
                  <Button className="mt-4 bg-[var(--gradient-primary)]">
                    Configure Forms
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;