// Navigation items configuration for the application

import { Home, Users, DollarSign, BarChart } from 'lucide-react';

export const userNavItems = [
  {
    title: 'Progress',
    url: '/MyProgress',
    icon: BarChart
  },
  {
    title: 'Home',
    url: '/',
    icon: Home
  }
];

export const adminNavItems = [
  {
    title: 'Dashboard',
    url: '/AdminDashboard', 
    icon: BarChart
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
  },
  {
    title: 'Home',
    url: '/',
    icon: Home
  }
];