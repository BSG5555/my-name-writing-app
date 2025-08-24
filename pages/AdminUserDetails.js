import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/entities/User';
import { Submission } from '@/entities/Submission';
import { Payment } from '@/entities/Payment';
import { AdminLog } from '@/entities/AdminLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  differenceInDays,
  format,
  isSameDay,
  startOfDay,
  isBefore,
  subDays,
  addDays,
  isAfter
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Unlock } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'react-hot-toast';

export default function AdminUserDetails() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const router = useRouter();
  const { userId } = router.query || {};

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [userData, userSubmissions, userPayments] = await Promise.all([
        User.get(userId),
        Submission.filter({ userId }),
        Payment.filter({ userId })
      ]);
      setUser(userData);
      setSubmissions(userSubmissions);
      setPayments(userPayments);
    } catch (error) {
      console.error('Failed to load user details', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUnlockUpload = async () => {
    if (!user) return;
    setIsUnlocking(true);
    try {
      const missedDays = [];
      let currentDay = startOfDay(new Date(user.created_date));
      const yesterday = startOfDay(subDays(new Date(), 1));

      while (isBefore(currentDay, yesterday) || isSameDay(currentDay, yesterday)) {
        const hasSubmission = submissions.find(s => isSameDay(new Date(s.date), currentDay));
        const hasPaid = payments.find(
          p => isSameDay(new Date(p.date), currentDay) && p.status === 'APPROVED'
        );
        if (!hasSubmission && !hasPaid) {
          missedDays.push(new Date(currentDay));
        }
        currentDay = addDays(currentDay, 1);
      }

      if (missedDays.length > 0) {
        const confirmUnlock = window.confirm(
          `Unlock ${missedDays.length} missed days for ${user.full_name}?`
        );
        if (!confirmUnlock) {
          setIsUnlocking(false);
          return;
        }

        await Payment.bulkCreate(
          missedDays.map(day => ({
            userId: user.id,
            date: format(day, 'yyyy-MM-dd'),
            amount: 0,
            status: 'APPROVED',
            mode: 'MANUAL',
            transactionId: `ADMIN_UNLOCK_${Date.now()}`
          }))
        );

        await AdminLog.create({
          action: 'UNLOCK_UPLOAD',
          userId: user.id,
          adminId: 'currentAdmin.id', // Replace with actual admin ID in real context
          timestamp: new Date().toISOString()
        });

        toast.success(`Unlocked ${missedDays.length} missed days for ${user.full_name}`);
        await loadData();
      } else {
        toast.success('No pending penalties to unlock');
      }
    } catch (error) {
      console.error('Failed to unlock upload:', error);
      toast.error('Failed to unlock upload');
    } finally {
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">User not found.</p>
        <Button
          onClick={() => router.push(createPageUrl('AdminUsers'))}
          className="mt-4"
          aria-label="Back to user list"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
        </Button>
      </div>
    );
  }

  const stats = {
    daysSinceJoined: differenceInDays(new Date(), new Date(user.created_date)) || 0,
    daysUploaded: submissions.length,
    paymentsMade: payments.filter(p => p.status === 'APPROVED').length,
    totalPaid: payments
      .filter(p => p.status === 'APPROVED')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push(createPageUrl('AdminUsers'))}
          className="flex items-center gap-2"
          aria-label="Go back to user list"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleUnlockUpload}
          disabled={isUnlocking}
          className="bg-orange-500 hover:bg-orange-600"
          aria-label="Unlock all penalties for user"
        >
          <Unlock className="w-4 h-4 mr-2" />
          {isUnlocking ? 'Unlocking...' : 'Unlock All Penalties'}
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white">
            <AvatarImage src={user.profilePhotoUrl} />
            <AvatarFallback>{user.full_name ? user.full_name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            <p>{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {key === 'totalPaid' ? `₹${value}` : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            disabled={(date) =>
              isAfter(date, new Date()) ||
              isBefore(date, startOfDay(new Date(user.created_date)))
            }
            modifiers={{
              completed: submissions.map(s => new Date(s.date)),
              paid: payments
                .filter(p => p.status === 'APPROVED')
                .map(p => new Date(p.date))
            }}
            modifiersClassNames={{
              completed: 'bg-emerald-100 rounded-md',
              paid: 'bg-blue-100 rounded-md'
            }}
            modifiersLabels={{
              completed: 'Submission uploaded',
              paid: 'Penalty paid'
            }}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
