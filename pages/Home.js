import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { useRouter } from 'next/router';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await User.me();
        if (user) {
          const targetPage = user.role === 'admin' ? 'AdminDashboard' : 'MyProgress';
          router.replace(createPageUrl(targetPage));
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setError('Unable to verify user. Please try again.');
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Samarkan&display=swap');
        .font-samarkan { font-family: 'Samarkan', cursive; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-800">STOP &<br />TAKE A DEEP BREATH</h1>
        <p className="font-samarkan text-3xl md:text-4xl text-emerald-500 mt-2">Swayam Nama Likitha Sankalpa</p>
      </motion.div>

      {error && (
        <div className="mt-4 text-red-500 text-sm">{error}</div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-16 w-full max-w-xs"
      >
        <Button
          size="lg"
          className="w-full bg-white text-emerald-700 hover:bg-emerald-100 shadow-lg"
          aria-label="Login to your account"
          onClick={() => User.login()}
        >
          LOGIN
        </Button>
      </motion.div>
    </div>
  );
}