'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('profile');

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
      router.push('/');
    } catch (error) {
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

      toast({
        title: t('toast.dataExportRequested.title'),
        description: t('toast.dataExportRequested.description'),
      });
    } catch (error) {
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.dataExport'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
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
                <p className="text-muted-foreground">{session.user?.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-primary">{t('accountInfo.name')}</h3>
                <p className="text-muted-foreground">{session.user?.name || t('accountInfo.notProvided')}</p>
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
                  className="btn btn-primary w-full sm:w-auto"
                >
                  {t('dataManagement.deleteButton')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
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
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t('deleteAccount.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 