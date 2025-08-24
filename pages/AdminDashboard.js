import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import toast from 'react-hot-toast';
import { getStatusForUser } from '@/utils/status';

async function fetchDashboardData(selectedDate) {
  // Placeholder mock; replace with real API call
  return Promise.resolve([
    { id: 'u1', name: 'Alice Example', email: 'alice@example.com', image: '', submissions: 5, approved: 5 },
    { id: 'u2', name: 'Bob Sample', email: 'bob@example.com', image: '', submissions: 3, approved: 2 }
  ]);
}

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchDashboardData(selectedDate)
      .then(setData)
      .catch(() => toast.error('Failed to load data'));
  }, [selectedDate]);

  const filtered = data.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Status'];
    const rows = filtered.map(u => [u.name, u.email, getStatusForUser(u)]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <Button onClick={exportToCSV}>Export CSV</Button>
      </div>

      <Calendar selected={selectedDate} onSelect={setSelectedDate} />

      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2"
      />

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getStatusForUser(user)}</TableCell>
                <TableCell>
                  {user.image ? (
                    <Button variant="secondary" onClick={() => setModalImage(user.image)}>
                      Preview
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center space-x-2">
        <Button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
        <Button disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="bg-white rounded-md p-2 max-w-xl w-full" onClick={e => e.stopPropagation()}>
            <img src={modalImage} alt="Preview" className="max-w-full h-auto mx-auto" />
            <div className="text-right mt-2">
              <Button variant="secondary" onClick={() => setModalImage(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}