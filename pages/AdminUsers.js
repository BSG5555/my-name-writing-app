import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/entities/User';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { Search, Users as UsersIcon, UserCheck, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const USERS_PER_PAGE = 10;

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const allUsers = await User.list();
                setUsers(allUsers.filter(u => u.role !== 'admin'));
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error("Unable to load users");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users
            .filter(user =>
                (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.phone || '').includes(searchTerm)
            )
            .filter(user => selectedRole === 'all' || user.role === selectedRole);
    }, [users, searchTerm, selectedRole]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(start, start + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleBulkAction = () => {
        toast.success(`Bulk action triggered for ${selectedUsers.length} users`);
        // Implement actual bulk logic here
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <UsersIcon className="w-8 h-8 text-emerald-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
                        <p className="text-gray-500">Total: {users.length} users</p>
                    </div>
                </div>
                {selectedUsers.length > 0 && (
                    <Button onClick={handleBulkAction} aria-label="Perform bulk action">
                        Bulk Action ({selectedUsers.length})
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card className="bg-white shadow-sm">
                <CardContent className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            aria-label="Search users"
                        />
                    </div>
                    <div>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                            aria-label="Filter by role"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Regular Users</option>
                            <option value="moderator">Moderators</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-4">
                {paginatedUsers.length > 0 ? (
                    paginatedUsers.map(user => (
                        <Card key={user.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 flex items-center space-x-4">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => toggleUserSelection(user.id)}
                                    aria-label={`Select ${user.full_name}`}
                                />
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <span className="text-emerald-600 font-semibold text-lg">
                                            {(user.full_name || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0" onClick={() => router.push(createPageUrl(`AdminUserDetails?userId=${user.id}`))}>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                            {user.full_name || 'Unnamed User'}
                                        </h3>
                                        <UserCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center text-sm text-gray-400">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Joined {format(new Date(user.created_date), 'MMM dd, yyyy')}
                                        </div>
                                        {user.phone && (
                                            <span className="text-sm text-gray-500">📞 {user.phone}</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-8 text-center">
                            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms.' : 'No users have signed up yet.'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredUsers.length > USERS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        aria-label="Previous page"
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={currentPage * USERS_PER_PAGE >= filteredUsers.length}
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
