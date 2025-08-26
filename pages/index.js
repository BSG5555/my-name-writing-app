import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/entities/User';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    try {
      const user = await User.login(email, password);
      const targetPage = user.role === 'admin' ? 'AdminDashboard' : 'MyProgress';
      router.replace(createPageUrl(targetPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500" />
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

      {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-16 w-full max-w-xs"
      >
        {!showLoginForm ? (
          <Button
            onClick={() => setShowLoginForm(true)}
            className="w-full bg-white text-emerald-700 hover:bg-emerald-100 shadow-lg"
          >
            LOGIN
          </Button>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="flex-1"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowLoginForm(false);
                  setEmail('');
                  setPassword('');
                  setError(null);
                }}
                disabled={isLoggingIn}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
