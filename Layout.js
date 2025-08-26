import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createPageUrl } from '@/utils';
import { User } from '@/entities/User';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { userNavItems, adminNavItems } from '@/config/navItems'; // Modularized nav items

function NavLink({ item, currentPath }) {
  const isActive = currentPath === item.url;
  return (
    <Link
      href={item.url}
      className={`flex flex-col items-center justify-center flex-1 p-3 transition-colors duration-200 ${
        isActive ? 'text-emerald-600 bg-emerald-50 rounded-lg' : 'text-gray-500 hover:text-emerald-500'
      }`}
      aria-label={`Navigate to ${item.title}`}
    >
      <item.icon className="w-5 h-5" />
      <span className="text-xs md:text-sm font-medium mt-1">{item.title}</span>
    </Link>
  );
}

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (currentUser.role === 'admin' && !router.pathname.startsWith('/Admin')) {
          router.replace(createPageUrl('AdminDashboard'));
        } else if (currentUser.role === 'user' && router.pathname.startsWith('/Admin')) {
          router.replace(createPageUrl('MyProgress'));
        }
      } catch (error) {
        if (!['Home', 'Signup'].includes(currentPageName)) {
          router.push(createPageUrl('Home'));
        }
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, [router.pathname, currentPageName]);

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await User.logout();
    toast.success("Logged out successfully");
    router.push(createPageUrl('Home'));
    window.location.reload();
  };

  const isPublicPage = ['Home', 'Signup'].includes(currentPageName);

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Samarkan&family=Inter:wght@400;500;600;700&display=swap');
        body, .font-sans {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        .font-samarkan { font-family: 'Samarkan', cursive; }
        * { box-sizing: border-box; }
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 142.1 76.2% 36.3%;
          --primary-foreground: 355.7 100% 97.3%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 142.1 70% 90%;
          --accent-foreground: 142.1 80% 20%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 142.1 76.2% 36.3%;
          --radius: 0.75rem;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --background: 222.2 84% 4.9%;
            --foreground: 0 0% 100%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 0 0% 100%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 0 0% 100%;
            --primary: 142.1 76.2% 36.3%;
            --primary-foreground: 0 0% 100%;
            --secondary: 210 40% 20%;
            --secondary-foreground: 0 0% 100%;
            --muted: 210 40% 20%;
            --muted-foreground: 215.4 16.3% 70%;
            --accent: 142.1 70% 30%;
            --accent-foreground: 0 0% 100%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 0 0% 100%;
            --border: 214.3 31.8% 30%;
            --input: 214.3 31.8% 30%;
            --ring: 142.1 76.2% 36.3%;
          }
        }
      `}</style>

      {isPublicPage && !user ? (
        <div className="bg-emerald-50 min-h-screen">{children}</div>
      ) : !user ? (
        <div className="flex items-center justify-center min-h-screen bg-emerald-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="flex flex-col h-screen bg-emerald-50 text-gray-800 font-sans dark:bg-gray-900 dark:text-white">
          {/* Header */}
          <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-20 dark:bg-gray-800 dark:border-gray-700">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-400">My Name Writing</h1>
              <p className="font-samarkan text-sm md:text-base text-emerald-500 dark:text-emerald-300 -mt-1">
                Swayam Nama Likitha Sankalpa
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-20">
            <div className="p-4 min-h-full">{children}</div>
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-emerald-100 z-30 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-around items-center h-16 px-2">
              {navItems.map(item => (
                <NavLink key={item.title} item={item} currentPath={router.pathname} />
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
