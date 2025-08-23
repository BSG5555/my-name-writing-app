import React, { useState, useEffect, useMemo } from 'react';
import { Payment } from '@/entities/Payment';
import { User } from '@/entities/User';
import { AdminLog } from '@/entities/AdminLog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const PAYMENTS_PER_PAGE = 10;

export default function AdminPendingPayments() {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [allPayments, allUsers] = await Promise.all([
                    Payment.list(),
                    User.list()
                ]);
                const pendingPayments = allPayments.filter(p => p.status === 'PENDING');
                setPayments(pendingPayments);
                setUsers(allUsers);
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("Failed to load payments");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const getUser = (userId) => users.find(u => u.id === userId);
    const getUserName = (userId) => getUser(userId)?.full_name || 'Unknown User';

    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const user = getUser(p.userId);
            return (
                !searchTerm ||
                (user?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [payments, users, searchTerm]);

    const paginatedPayments = useMemo(() => {
        const start = (currentPage - 1) * PAYMENTS_PER_PAGE;
        return filteredPayments.slice(start, start + PAYMENTS_PER_PAGE);
    }, [filteredPayments, currentPage]);

    const handlePaymentAction = async (paymentId, status) => {
        const payment = payments.find(p => p.id === paymentId);
        const user = getUser(payment.userId);
        const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} this payment for ${user?.full_name}?`);
        if (!confirm) return;

        try {
            await Payment.update(paymentId, { status });
            await AdminLog.create({
                action: 'UPDATE_PAYMENT_STATUS',
                paymentId,
                status,
                adminId: 'currentAdmin.id', // Replace with actual admin ID
                timestamp: new Date().toISOString()
            });
            setPayments(prev => prev.filter(p => p.id !== paymentId));
            toast.success(`Payment ${status.toLowerCase()} successfully`);
        } catch (error) {
            console.error("Failed to update payment:", error);
            toast.error("Failed to update payment");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Pending Payments</h1>

            <Input
                placeholder="Search by user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
                aria-label="Search payments by user"
            />

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Proof</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPayments.map(payment => {
                            const userName = getUserName(payment.userId);
                            return (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{userName}</TableCell>
                                    <TableCell>{format(new Date(payment.date), 'PPP')}</TableCell>
                                    <TableCell>₹{payment.amount}</TableCell>
                                    <TableCell>
                                        {payment.proofUrl && (
                                            <a
                                                href={payment.proofUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                                aria-label={`View proof for payment by ${userName}`}
                                            >
                                                View Proof
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handlePaymentAction(payment.id, 'APPROVED')}
                                            aria-label={`Approve payment for ${userName}`}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handlePaymentAction(payment.id, 'REJECTED')}
                                            aria-label={`Reject payment for ${userName}`}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {paginatedPayments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                    No pending payments.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {filteredPayments.length > PAYMENTS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        aria-label="Previous page"
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={currentPage * PAYMENTS_PER_PAGE >= filteredPayments.length}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        aria-label="Next page"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
