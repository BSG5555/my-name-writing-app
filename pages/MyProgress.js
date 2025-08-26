import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/entities/User';
import { Submission } from '@/entities/Submission';
import { Payment } from '@/entities/Payment';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadFile } from '@/integrations/Core';
import { format, startOfDay, isBefore, isSameDay, isAfter, addDays, subDays } from 'date-fns';
import { Check, X, AlertTriangle, Upload, Send, FileImage } from 'lucide-react';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { calculateMissedDays } from '@/utils/progress';

const WHATSAPP_ADMIN_NUMBER = '916362359655';
const RAZORPAY_KEY_ID = 'rzp_test_R8lmSAdxscmtFs';
const FINE_PER_DAY = 100;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function MyProgressPage() {
    // ...rest of your component logic remains the same (see previous response)
    // Replace any previous definition of calculateMissedDays with the import above
}