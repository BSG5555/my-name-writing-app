import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Calendar, Table } from './components'; // Assume these are prebuilt
import { toast } from 'react-hot-toast';
import { getStatusForUser } from './utils/status';
import { fetchDashboardData } from './api';

const AdminDashboard = () => {
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

  const filteredData = data.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Status'];
    const rows = filteredData.map(user => [
      user.name,
      user.email,
      getStatusForUser(user)
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dashboard.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <Button onClick={exportToCSV}>Export CSV</Button>
      </div>

      <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />

      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2"
      />

      <Table
        data={paginatedData}
        columns={[
          { label: 'Name', accessor: 'name' },
          { label: 'Email', accessor: 'email' },
          {
            label: 'Status',
            render: user => getStatusForUser(user)
          },
          {
            label: 'Image',
            render: user => (
              <Button onClick={() => setModalImage(user.image)}>Preview</Button>
            )
          }
        ]}
      />

      <div className="flex justify-center space-x-2">
        <Button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
        <Button disabled={(page + 1) * pageSize >= filteredData.length} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      {modalImage && (
        <Modal onClose={() => setModalImage(null)}>
          <img src={modalImage} alt="Submission Preview" className="max-w-full" />
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
