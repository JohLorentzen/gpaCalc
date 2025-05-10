'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('profile');
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [supabase]);

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete account');
      }

      toast({
        title: t('toast.accountDeleted.title'),
        description: t('toast.accountDeleted.description'),
      });
      
      // Redirect to logging-out page instead of home
      const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';
      router.push(`/${locale}/logging-out`);
    } catch {
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.deleteAccount'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile/export', {
        
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request data export');
      }

      // Get the CSV as a blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profile_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: t('toast.dataExportRequested.title'),
        description: t('toast.dataExportRequested.description'),
      });
    } catch {
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.dataExport'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 gradient-text">{t('title')}</h1>
        <p className="text-muted-foreground">{t('signInPrompt')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 gradient-text">{t('title')}</h1>
      
      <div className="grid gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="gradient-text">{t('accountInfo.title')}</CardTitle>
            <CardDescription>{t('accountInfo.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-primary">{t('accountInfo.email')}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-primary">{t('accountInfo.name')}</h3>
                <p className="text-muted-foreground">{user.user_metadata?.full_name || t('accountInfo.notProvided')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="gradient-text">{t('dataManagement.title')}</CardTitle>
            <CardDescription>{t('dataManagement.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={handleRequestData}
                disabled={isLoading}
                className="btn btn-primary w-full sm:w-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span>
                    {t('dataManagement.exportButton')}
                  </span>
                ) : (
                  t('dataManagement.exportButton')
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isLoading}
                    className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive/10"
                  >
                    {t('dataManagement.deleteButton')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background text-text">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteAccount.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('deleteAccount.description')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('deleteAccount.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90"
                    >
                      {t('deleteAccount.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 