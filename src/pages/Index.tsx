import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          NxtWave Growth Hub
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          All-in-One Marketing Automation Platform for Lead Nurturing, Chatbot Qualification, and Form Management
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = '/auth'} 
            size="lg"
            className="bg-[var(--gradient-primary)] hover:shadow-[var(--shadow-elegant)] transition-all px-8 py-3 text-lg"
          >
            Access Dashboard
          </Button>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your marketing automation workflows
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
