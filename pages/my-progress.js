import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/entities/User';
import { Submission } from '@/entities/Submission';
import { Payment } from '@/entities/Payment';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadFile } from '@/integrations/Core';
import { format, startOfDay, isBefore, isSameDay, isAfter, addDays, subDays } from 'date-fns';
import { Check, X, AlertTriangle, Send, FileImage } from 'lucide-react';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import toast from 'react-hot-toast';
import { calculateMissedDays } from '@/utils/progress';

const WHATSAPP_ADMIN_NUMBER = '916362359655';
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_R8lmSAdxscmtFs';
const FINE_PER_DAY = 100;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function MyProgressPage() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [missedDaysInfo, setMissedDaysInfo] = useState({ days: [], totalPenalty: 0 });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [month, setMonth] = useState(new Date());
  const router = useRouter();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const [userSubmissions, userPayments] = await Promise.all([Submission.list(), Payment.list()]);
      setSubmissions(userSubmissions);
      setPayments(userPayments);
      const missed = calculateMissedDays(currentUser, userSubmissions, userPayments);
      setMissedDaysInfo({ days: missed, totalPenalty: missed.length * FINE_PER_DAY });
    } catch (error) {
      console.error('Failed to load data', error);
      toast.error('Failed to load progress data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpload = async () => {
    if (!file) return;
    if (!navigator.onLine) {
      toast.error("You're offline. Please connect to the internet.");
      return;
    }
    if (!/^image\//.test(file.type)) {
      toast.error('Invalid file type. Please select an image.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('File too large. Max size is 5MB.');
      return;
    }
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await Submission.create({
        userId: user.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        fileUrl: file_url,
        paymentStatus: 'APPROVED',
      });
      setFile(null);
      setImagePreview(null);
      toast.success('Upload successful!');
      await loadData();
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const initiatePenaltyPayment = async () => {
    if (!navigator.onLine) {
      toast.error("You're offline. Please connect to the internet.");
      return;
    }
    // Simulated order creation (replace with secure backend action for production)
    const createSimulatedOrder = (amount) =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              id: `order_${Date.now()}`,
              amount,
              currency: 'INR',
            }),
          400
        )
      );

    try {
      const order = await createSimulatedOrder(missedDaysInfo.totalPenalty * 100);
      const paymentRecord = await Payment.create({
        userId: user.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: missedDaysInfo.totalPenalty,
        status: 'CREATED',
        mode: 'RAZORPAY',
        razorpay_order_id: order.id,
      });

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Swayam Nama Likitha Sankalpa',
        description: `Penalty for ${missedDaysInfo.days.length} missed day(s)`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await Payment.update(paymentRecord.id, {
              status: 'APPROVED',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Your upload is unlocked.');
            await loadData();
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.full_name,
          email: user?.email,
          contact: user?.phone || '',
        },
        theme: { color: '#10B981' },
        modal: { ondismiss: () => toast.error("Payment cancelled. Your upload remains locked.") },
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Payment module not available. Please contact support.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('Failed to create payment order. Please contact support.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500" aria-label="Loading spinner" />
      </div>
    );
  }

  const today = startOfDay(new Date());
  const isLocked = missedDaysInfo.days.length > 0;
  const todaysSubmission = submissions.find((s) => isSameDay(new Date(s.date), today));

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Progress</CardTitle>
          <div className="flex gap-2">
            <button onClick={() => setMonth(new Date())} aria-label="Go to today in calendar" className="btn-outline-sm">Today</button>
            <button onClick={() => router.push('/admin')} aria-label="Admin view" className="btn-ghost-sm">Admin View</button>
          </div>
        </CardHeader>
        <CardContent>
          <style>{`.day-icon { position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); }`}</style>
          <Calendar
            month={month}
            onMonthChange={setMonth}
            mode="single"
            disabled={(date) => isAfter(date, today) || (user && isBefore(date, startOfDay(new Date(user.created_date))))}
            components={{
              Day: ({ date }) => {
                const status = (() => {
                  if (isAfter(date, today) || (user && isBefore(date, startOfDay(new Date(user.created_date))))) return null;
                  if (submissions.find((s) => isSameDay(new Date(s.date), date))) return 'completed';
                  if (payments.find((p) => isSameDay(new Date(p.date), date) && p.status === 'APPROVED')) return 'completed';
                  if (isSameDay(date, today)) return 'pending';
                  return 'missed';
                })();
                return (
                  <div className="relative">
                    {format(date, 'd')}
                    {status === 'completed' && <Check className="day-icon w-4 h-4 text-emerald-500" aria-label="Completed" />}
                    {status === 'missed' && <X className="day-icon w-4 h-4 text-red-500" aria-label="Missed submission" />}
                    {status === 'pending' && !isLocked && <AlertTriangle className="day-icon w-4 h-4 text-amber-500" aria-label="Pending submission" />}
                    {status === 'pending' && isLocked && <X className="day-icon w-4 h-4 text-red-500" aria-label="Submission locked" />}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      {isLocked && !todaysSubmission && (
        <Card className="bg-red-50 border-red-200 shadow-md">
          <CardHeader><CardTitle className="text-red-800">Upload Locked</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-red-700">You missed {missedDaysInfo.days.length} submission(s). Pay the penalty to unlock today's upload.</p>
            <button onClick={initiatePenaltyPayment} className="w-full bg-red-600 hover:bg-red-700" aria-label="Pay penalty and unlock upload">
              Pay Penalty (₹{missedDaysInfo.totalPenalty})
            </button>
            <a href={`https://wa.me/${WHATSAPP_ADMIN_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-full block text-center border rounded px-4 py-2">
              <Send className="inline mr-2" /> Contact Support on WhatsApp
            </a>
          </CardContent>
        </Card>
      )}

      {!isLocked && !todaysSubmission && (
        <Card className="bg-white shadow-md">
          <CardHeader><CardTitle>Upload for Today</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {imagePreview ? (
              <div className="text-center space-y-4">
                <img src={imagePreview} alt="Preview" className="rounded-lg w-full max-w-sm mx-auto h-48 object-cover border-2 border-emerald-200" />
                <button onClick={handleUpload} disabled={isUploading} className="w-full bg-emerald-600 hover:bg-emerald-700" aria-label="Confirm and upload image">
                  {isUploading ? 'Uploading...' : 'Confirm & Upload'}
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="block w-full h-32 border-2 border-dashed border-emerald-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors" aria-label="Upload image">
                <FileImage className="w-8 h-8 text-emerald-400" />
                <span className="mt-2 text-sm text-emerald-600 font-medium">Tap to Upload Image (Max 5MB)</span>
                <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            )}
          </CardContent>
        </Card>
      )}

      {todaysSubmission && (
        <Card className="bg-white shadow-md">
          <CardHeader><CardTitle>Today's Submission Complete</CardTitle></CardHeader>
          <CardContent className="text-center">
            <img src={todaysSubmission.fileUrl} alt="Submission" className="rounded-lg w-full max-w-sm mx-auto shadow-sm" />
            <p className="text-sm text-gray-500 mt-2">Uploaded at {format(new Date(todaysSubmission.created_date), 'p')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
