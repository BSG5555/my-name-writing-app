import { Home, Calendar, Users, DollarSign, BarChart3 } from 'lucide-react';

export const userNavItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'Progress',
    url: '/my-progress',
    icon: Calendar
  }
];

export const adminNavItems = [
  {
    title: 'Dashboard',
    url: '/AdminDashboard',
    icon: BarChart3
  },
  {
    title: 'Users',
    url: '/AdminUsers',
    icon: Users
  },
  {
    title: 'Payments',
    url: '/AdminPendingPayments',
    icon: DollarSign
  }
];