import { Users, BookOpen, UserCheck, Calendar } from 'lucide-react';

export const overviewData = [
  { month: 'Jan', students: 400, transactions: 120 },
  { month: 'Feb', students: 630, transactions: 260 },
  { month: 'Mar', students: 700, transactions: 310 },
  { month: 'Apr', students: 750, transactions: 260 },
  { month: 'May', students: 860, transactions: 310 },
  { month: 'Jun', students: 820, transactions: 310 },
  { month: 'Jul', students: 920, transactions: 370 },
  { month: 'Aug', students: 990, transactions: 390 },
  { month: 'Sep', students: 1200, transactions: 490 },
  { month: 'Oct', students: 1090, transactions: 430 },
  { month: 'Nov', students: 940, transactions: 350 },
  { month: 'Dec', students: 1050, transactions: 410 },
];

export const statCards = [
  {
    title: 'Total Students',
    value: '2,580',
    trend: '5%',
    color: '#1464F6',
    bgIcon: 'bg-[#1464F6]',
    icon: Users,
    sparkData: [{ v: 20 }, { v: 35 }, { v: 30 }, { v: 55 }, { v: 45 }, { v: 70 }, { v: 60 }]
  },
  {
    title: 'Books in Library',
    value: '12,450',
    trend: '2%',
    color: '#7C4DFF',
    bgIcon: 'bg-[#7C4DFF]',
    icon: BookOpen,
    sparkData: [{ v: 15 }, { v: 25 }, { v: 40 }, { v: 35 }, { v: 50 }, { v: 45 }, { v: 65 }]
  },
  {
    title: 'Faculty Members',
    value: '245',
    trend: '1%',
    color: '#109E62',
    bgIcon: 'bg-[#109E62]',
    icon: UserCheck,
    sparkData: [{ v: 10 }, { v: 25 }, { v: 20 }, { v: 45 }, { v: 55 }, { v: 48 }, { v: 60 }]
  },
  {
    title: 'Transactions',
    value: '1,250',
    trend: '8%',
    color: '#F58A07',
    bgIcon: 'bg-[#F58A07]',
    icon: Calendar,
    sparkData: [{ v: 15 }, { v: 30 }, { v: 25 }, { v: 45 }, { v: 40 }, { v: 65 }, { v: 75 }]
  },
];

export const notices = [
  { text: 'Library will remain closed on 20 Nov 2026 for maintenance.', date: 'Nov 17, 2026', barColor: 'bg-orange-500' },
  { text: 'Semester Examination Form Fill-up Started.', date: 'Nov 15, 2026', barColor: 'bg-amber-400' },
  { text: 'New Books Added to Library – Check Now!', date: 'Nov 12, 2026', barColor: 'bg-emerald-500' },
  { text: 'College Annual Function on 25 Dec 2026.', date: 'Nov 10, 2026', barColor: 'bg-indigo-500' },
];

export const activities = [
  { text: 'A new book "Data Science Basics" added to library.', time: '2h ago' },
  { text: 'Student Riya Sharma registered.', time: '3h ago' },
  { text: 'Book "Python Programming" issued to Amit Roy.', time: '4h ago' },
  { text: 'Examination schedule updated.', time: '5h ago' },
];

export const studentsList = [
  { id: 'STU-1001', name: 'Riya Sharma', dept: 'Computer Science', year: '3rd Year', status: 'Active' },
  { id: 'STU-1002', name: 'Amit Roy', dept: 'Electronics', year: '2nd Year', status: 'Active' },
  { id: 'STU-1003', name: 'Sneha Das', dept: 'Commerce', year: '1st Year', status: 'Active' },
  { id: 'STU-1004', name: 'Rahul Verma', dept: 'Mechanical', year: '4th Year', status: 'Pending Fee' },
  { id: 'STU-1005', name: 'Priya Sen', dept: 'Computer Science', year: '2nd Year', status: 'Active' },
];

export const facultyList = [
  { id: 'FAC-201', name: 'Dr. S. K. Mukherjee', dept: 'Computer Science', role: 'Professor & HOD', email: 'skm@bbcollege.edu' },
  { id: 'FAC-202', name: 'Prof. Ananya Banerjee', dept: 'Mathematics', role: 'Associate Professor', email: 'ananya@bbcollege.edu' },
  { id: 'FAC-203', name: 'Dr. Rajeev Chatterjee', dept: 'Physics', role: 'Assistant Professor', email: 'rajeev@bbcollege.edu' },
];

export const libraryBooks = [
  { isbn: '978-0134685991', title: 'Effective Java', author: 'Joshua Bloch', category: 'Programming', status: 'Available' },
  { isbn: '978-1491957660', title: 'Python for Data Analysis', author: 'Wes McKinney', category: 'Data Science', status: 'Issued' },
  { isbn: '978-0262033848', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'CS Core', status: 'Available' },
];

export const transactionsList = [
  { id: 'TXN-501', student: 'Riya Sharma (STU-1001)', type: 'Semester Fee', amount: '₹18,500', date: 'Nov 16, 2026', status: 'Paid' },
  { id: 'TXN-502', student: 'Amit Roy (STU-1002)', type: 'Library Fine', amount: '₹150', date: 'Nov 15, 2026', status: 'Paid' },
  { id: 'TXN-503', student: 'Rahul Verma (STU-1004)', type: 'Semester Fee', amount: '₹18,500', date: 'Nov 14, 2026', status: 'Pending' },
  { id: 'TXN-504', student: 'Sneha Das (STU-1003)', type: 'Exam Form Fee', amount: '₹1,200', date: 'Nov 12, 2026', status: 'Paid' },
];

export const examinationsList = [
  { code: 'CS-501', subject: 'Database Management Systems', dept: 'Computer Science', date: 'Dec 02, 2026', time: '10:00 AM - 01:00 PM', room: 'Hall A-101', status: 'Scheduled' },
  { code: 'EC-302', subject: 'Digital Signal Processing', dept: 'Electronics', date: 'Dec 04, 2026', time: '10:00 AM - 01:00 PM', room: 'Hall B-204', status: 'Scheduled' },
  { code: 'CM-104', subject: 'Financial Accounting', dept: 'Commerce', date: 'Dec 05, 2026', time: '02:00 PM - 05:00 PM', room: 'Hall C-102', status: 'Scheduled' },
  { code: 'ME-701', subject: 'Thermodynamics II', dept: 'Mechanical', date: 'Nov 10, 2026', time: '10:00 AM - 01:00 PM', room: 'Lab Complex 2', status: 'Completed' },
];

export const departmentStats = [
  { dept: 'Computer Science', students: 780, passRate: 94 },
  { dept: 'Commerce', students: 640, passRate: 89 },
  { dept: 'Electronics', students: 490, passRate: 91 },
  { dept: 'Mechanical', students: 420, passRate: 86 },
  { dept: 'Physics', students: 250, passRate: 92 },
];