import type { Student, Room, Fee, Complaint, Notice, User } from './types';

export const users: (User | Student)[] = [
  { id: 'admin-1', name: 'Admin User', email: 'admin@campus.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/admin-1/100/100' },
  { id: 'student-1', name: 'Alice Johnson', email: 'alice@campus.com', role: 'student', studentId: 'S001', roomId: 'room-101', avatarUrl: 'https://picsum.photos/seed/student-1/100/100' },
  { id: 'student-2', name: 'Bob Williams', email: 'bob@campus.com', role: 'student', studentId: 'S002', roomId: 'room-101', avatarUrl: 'https://picsum.photos/seed/student-2/100/100' },
  { id: 'student-3', name: 'Charlie Brown', email: 'charlie@campus.com', role: 'student', studentId: 'S003', roomId: 'room-102', avatarUrl: 'https://picsum.photos/seed/student-3/100/100' },
  { id: 'student-4', name: 'Diana Prince', email: 'diana@campus.com', role: 'student', studentId: 'S004', roomId: null, avatarUrl: 'https://picsum.photos/seed/student-4/100/100' },
];

export const students: Student[] = users.filter(u => u.role === 'student') as Student[];

export const rooms: Room[] = [
  { id: 'room-101', roomNumber: '101', capacity: 2, occupants: ['student-1', 'student-2'] },
  { id: 'room-102', roomNumber: '102', capacity: 2, occupants: ['student-3'] },
  { id: 'room-103', roomNumber: '103', capacity: 2, occupants: [] },
  { id: 'room-201', roomNumber: '201', capacity: 1, occupants: [] },
  { id: 'room-202', roomNumber: '202', capacity: 1, occupants: [] },
];

export const fees: Fee[] = [
  { id: 'fee-1', studentId: 'student-1', amount: 5000, dueDate: '2024-08-01', status: 'Paid' },
  { id: 'fee-2', studentId: 'student-2', amount: 5000, dueDate: '2024-08-01', status: 'Unpaid' },
  { id: 'fee-3', studentId: 'student-3', amount: 5000, dueDate: '2024-07-01', status: 'Overdue' },
  { id: 'fee-4', studentId: 'student-4', amount: 5000, dueDate: '2024-08-01', status: 'Unpaid' },
];

export const complaints: Complaint[] = [
  { id: 'comp-1', studentId: 'student-1', title: 'Leaky Faucet', description: 'The faucet in the bathroom is constantly dripping.', date: '2024-07-15', status: 'Resolved' },
  { id: 'comp-2', studentId: 'student-3', title: 'Wi-Fi not working', description: 'The internet connection in my room is very unstable.', date: '2024-07-20', status: 'In Progress' },
  { id: 'comp-3', studentId: 'student-2', title: 'Noise Complaint', description: 'Loud music from the room next door late at night.', date: '2024-07-22', status: 'Pending' },
];

export const notices: Notice[] = [
  { id: 'notice-1', title: 'Annual Maintenance Schedule', content: 'This is to inform all students that the annual maintenance of the hostel premises will be conducted from August 5th to August 10th. Please cooperate with the maintenance staff. Some services like water and electricity may be interrupted for short durations. A detailed schedule will be posted on the main board.', summary: 'Annual hostel maintenance is from Aug 5-10. Expect brief utility interruptions and please cooperate.', date: '2024-07-18' },
  { id: 'notice-2', title: 'Upcoming Holiday: Independence Day', content: 'The hostel will observe a holiday on August 15th for Independence Day. The mess will operate on a limited schedule. All are invited to the flag hoisting ceremony at 9:00 AM in the main lawn.', summary: 'Hostel holiday on Aug 15 for Independence Day. Limited mess services. Flag hoisting at 9 AM on the main lawn.', date: '2024-07-25' },
];

// Mock API functions
export const getUserById = (id: string) => users.find(s => s.id === id);
export const getStudentById = (id: string) => students.find(s => s.id === id);
export const getRoomById = (id: string) => rooms.find(r => r.id === id);
