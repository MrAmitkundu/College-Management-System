// Mock database of students for individual analytics lookup
export const MOCK_STUDENTS = [
  {
    id: 'STU2026001',
    name: 'Aarav Sharma',
    department: 'CSE',
    semester: 6,
    currentCgpa: 8.6,
    currentAttendance: 88,
    codingScore: 84,
    internships: 2,
    backlogs: 0,
    placement: {
      probability: 91,
      expectedPackageLpa: '11.5 - 14.0 LPA',
      tier: 'Tier-1 Product',
      topStrengths: ['DSA & Problem Solving', '2 Completed Internships', 'High CGPA'],
      improvementTip: 'Add 1 cloud/system-design project to push probability above 95%.'
    },
    attendance: {
      predictedEndSem: 86,
      status: 'Safe',
      classesCanMiss: 9,
      monthlyTrend: [
        { month: 'Aug', actual: 92, predicted: 92 },
        { month: 'Sep', actual: 89, predicted: 89 },
        { month: 'Oct', actual: 88, predicted: 88 },
        { month: 'Nov', actual: null, predicted: 87 },
        { month: 'Dec', actual: null, predicted: 86 },
      ]
    },
    marks: {
      predictedNextSgpa: 8.85,
      subjectForecasts: [
        { subject: 'Machine Learning', currentInternal: 27, predictedTotal: 89 },
        { subject: 'Cloud Computing', currentInternal: 25, predictedTotal: 84 },
        { subject: 'Compiler Design', currentInternal: 26, predictedTotal: 86 },
        { subject: 'Software Engg.', currentInternal: 28, predictedTotal: 92 },
      ]
    }
  },
  {
    id: 'STU2026002',
    name: 'Priya Verma',
    department: 'ECE',
    semester: 6,
    currentCgpa: 7.2,
    currentAttendance: 69,
    codingScore: 61,
    internships: 0,
    backlogs: 1,
    placement: {
      probability: 54,
      expectedPackageLpa: '4.5 - 6.0 LPA',
      tier: 'IT Services / Core Entry',
      topStrengths: ['Embedded Systems Lab', 'Good Communication'],
      improvementTip: 'Clear 1 active backlog and complete an industry internship to unlock Tier-1 drives.'
    },
    attendance: {
      predictedEndSem: 66,
      status: 'Critical Risk',
      classesNeededFor75: 14,
      monthlyTrend: [
        { month: 'Aug', actual: 78, predicted: 78 },
        { month: 'Sep', actual: 73, predicted: 73 },
        { month: 'Oct', actual: 69, predicted: 69 },
        { month: 'Nov', actual: null, predicted: 67 },
        { month: 'Dec', actual: null, predicted: 66 },
      ]
    },
    marks: {
      predictedNextSgpa: 7.35,
      subjectForecasts: [
        { subject: 'VLSI Design', currentInternal: 19, predictedTotal: 68 },
        { subject: 'Digital Signal Proc.', currentInternal: 21, predictedTotal: 74 },
        { subject: 'Microcontrollers', currentInternal: 23, predictedTotal: 78 },
        { subject: 'Control Systems', currentInternal: 18, predictedTotal: 65 },
      ]
    }
  },
  {
    id: 'STU2026003',
    name: 'Rohan Das',
    department: 'ME',
    semester: 4,
    currentCgpa: 7.9,
    currentAttendance: 77,
    codingScore: 55,
    internships: 1,
    backlogs: 0,
    placement: {
      probability: 74,
      expectedPackageLpa: '6.0 - 7.8 LPA',
      tier: 'Core Manufacturing / Analytics',
      topStrengths: ['CAD/CAM Certification', 'Zero Backlogs'],
      improvementTip: 'Build Python/Data Analytics skills alongside core CAD to target consulting roles.'
    },
    attendance: {
      predictedEndSem: 75,
      status: 'Borderline',
      classesCanMiss: 1,
      monthlyTrend: [
        { month: 'Aug', actual: 82, predicted: 82 },
        { month: 'Sep', actual: 79, predicted: 79 },
        { month: 'Oct', actual: 77, predicted: 77 },
        { month: 'Nov', actual: null, predicted: 76 },
        { month: 'Dec', actual: null, predicted: 75 },
      ]
    },
    marks: {
      predictedNextSgpa: 8.05,
      subjectForecasts: [
        { subject: 'Thermodynamics II', currentInternal: 24, predictedTotal: 81 },
        { subject: 'Fluid Mechanics', currentInternal: 22, predictedTotal: 77 },
        { subject: 'Machine Design', currentInternal: 25, predictedTotal: 84 },
        { subject: 'Manufacturing Tech', currentInternal: 23, predictedTotal: 79 },
      ]
    }
  }
];

// Whole-college aggregated ML insights
export const getCollegeAiSummary = async () => {
  // TODO: Replace with: const res = await fetch('/api/ai/college-summary'); return res.json();
  return {
    totalStudents: 2450,
    predictedPlacementRate: 84.2,
    avgPredictedAttendance: 81.5,
    atRiskAttendanceCount: 198,
    predictedCollegeAvgSgpa: 8.12,
    departmentForecasts: [
      { dept: 'CSE', placementProb: 92, avgAttendance: 85, avgMarks: 84 },
      { dept: 'IT', placementProb: 89, avgAttendance: 83, avgMarks: 82 },
      { dept: 'ECE', placementProb: 81, avgAttendance: 80, avgMarks: 78 },
      { dept: 'EE', placementProb: 76, avgAttendance: 78, avgMarks: 76 },
      { dept: 'ME', placementProb: 73, avgAttendance: 77, avgMarks: 75 },
      { dept: 'CE', placementProb: 70, avgAttendance: 79, avgMarks: 74 },
    ]
  };
};

// Fetch single student analytics or run custom what-if simulation
export const getStudentAiAnalytics = async (studentId) => {
  // TODO: Replace with: const res = await fetch(`/api/ai/student/${studentId}`); return res.json();
  return MOCK_STUDENTS.find((s) => s.id === studentId) || MOCK_STUDENTS[0];
};