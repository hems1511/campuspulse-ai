// ============================================================
// sampleData.js – Realistic demo data for CampusPulse AI
// ============================================================

export const CATEGORIES = [
  'Infrastructure',
  'Academic',
  'Hostel / Accommodation',
  'Cafeteria / Food',
  'Library',
  'Sports & Fitness',
  'Wi-Fi / Technology',
  'Safety & Security',
  'Transportation',
  'Administration',
  'Other',
];

export const PRIORITIES = ['High', 'Medium', 'Low'];
export const STATUSES   = ['Pending', 'In Progress', 'Resolved'];

// ── Sample Students ────────────────────────────────────────
export const DEMO_STUDENTS = [
  { id: 'stu-001', name: 'Aarav Mehta',   email: 'aarav@campus.edu',   role: 'student', rollNo: '22CS101', department: 'Computer Science', year: 3 },
  { id: 'stu-002', name: 'Priya Sharma',  email: 'priya@campus.edu',   role: 'student', rollNo: '22EC204', department: 'Electronics',       year: 2 },
  { id: 'stu-003', name: 'Ravi Kumar',    email: 'ravi@campus.edu',    role: 'student', rollNo: '21ME310', department: 'Mechanical',        year: 4 },
  { id: 'stu-004', name: 'Sneha Patel',   email: 'sneha@campus.edu',   role: 'student', rollNo: '23CS045', department: 'Computer Science', year: 1 },
];

// ── Sample Admins ──────────────────────────────────────────
export const DEMO_ADMINS = [
  { id: 'adm-001', name: 'Dr. Ramesh Iyer', email: 'admin@campus.edu', role: 'admin', department: 'Office of Student Affairs' },
];

// ── Sample Complaints ──────────────────────────────────────
export const INITIAL_COMPLAINTS = [
  {
    id: 'cmp-001',
    studentId: 'stu-001',
    studentName: 'Aarav Mehta',
    title: 'Wi-Fi dead zones in CS Block 2nd floor',
    description: 'The wireless network coverage in the CS department second floor is extremely poor. Students cannot attend online lectures or access learning resources. This has been ongoing for 3 weeks.',
    category: 'Wi-Fi / Technology',
    priority: 'High',
    status: 'In Progress',
    date: '2026-10-20',
    adminResponse: 'Our IT team is aware and has ordered new access points. Installation scheduled for next week.',
    aiCategory: 'Wi-Fi / Technology',
    aiSentiment: 'Negative',
    isRepeat: true,
    repeatCount: 4,
  },
  {
    id: 'cmp-002',
    studentId: 'stu-002',
    studentName: 'Priya Sharma',
    title: 'Cafeteria food quality has declined significantly',
    description: 'The quality and variety of food in the main cafeteria has drastically declined over the past month. Rice is often undercooked and vegetables are not fresh. Many students are skipping meals.',
    category: 'Cafeteria / Food',
    priority: 'High',
    status: 'Pending',
    date: '2026-10-22',
    adminResponse: null,
    aiCategory: 'Cafeteria / Food',
    aiSentiment: 'Negative',
    isRepeat: true,
    repeatCount: 7,
  },
  {
    id: 'cmp-003',
    studentId: 'stu-003',
    studentName: 'Ravi Kumar',
    title: 'Broken water taps in Hostel Block C',
    description: 'Multiple water taps in Hostel Block C bathrooms are either broken or leaking. Some rooms have had no water supply for 2 days. This is a serious hygiene and health issue.',
    category: 'Hostel / Accommodation',
    priority: 'High',
    status: 'Resolved',
    date: '2026-10-15',
    adminResponse: 'Maintenance team visited on Oct 17. All taps replaced and water supply restored. Thank you for reporting.',
    aiCategory: 'Hostel / Accommodation',
    aiSentiment: 'Negative',
    isRepeat: false,
    repeatCount: 1,
  },
  {
    id: 'cmp-004',
    studentId: 'stu-004',
    studentName: 'Sneha Patel',
    title: 'Library closes too early on weekends',
    description: 'The library closes at 5 PM on weekends which is very inconvenient, especially during exam season. Most students study in the evening. Extending hours to at least 9 PM would be very helpful.',
    category: 'Library',
    priority: 'Medium',
    status: 'Pending',
    date: '2026-10-24',
    adminResponse: null,
    aiCategory: 'Library',
    aiSentiment: 'Negative',
    isRepeat: true,
    repeatCount: 3,
  },
  {
    id: 'cmp-005',
    studentId: 'stu-001',
    studentName: 'Aarav Mehta',
    title: 'New lab equipment working great!',
    description: 'Just wanted to appreciate the new computers installed in Lab 3. They are super fast and have all the required software pre-installed. It has significantly improved our lab sessions.',
    category: 'Infrastructure',
    priority: 'Low',
    status: 'Resolved',
    date: '2026-10-18',
    adminResponse: 'Thank you for the kind feedback! We are glad the new equipment is improving your experience.',
    aiCategory: 'Infrastructure',
    aiSentiment: 'Positive',
    isRepeat: false,
    repeatCount: 1,
  },
  {
    id: 'cmp-006',
    studentId: 'stu-002',
    studentName: 'Priya Sharma',
    title: 'Sports complex timings need revision',
    description: 'The sports complex is only open during class hours, making it impossible for students to use it. It should open from 6 AM to 8 AM in the morning and 6 PM to 9 PM in the evening.',
    category: 'Sports & Fitness',
    priority: 'Medium',
    status: 'In Progress',
    date: '2026-10-26',
    adminResponse: 'We are reviewing the request and coordinating with the sports department.',
    aiCategory: 'Sports & Fitness',
    aiSentiment: 'Neutral',
    isRepeat: false,
    repeatCount: 2,
  },
  {
    id: 'cmp-007',
    studentId: 'stu-003',
    studentName: 'Ravi Kumar',
    title: 'Campus bus service is unreliable',
    description: "The shuttle bus from the main gate to academic blocks frequently runs late or doesn't show up at all. Students are forced to walk long distances, especially in bad weather.",
    category: 'Transportation',
    priority: 'High',
    status: 'Pending',
    date: '2026-10-27',
    adminResponse: null,
    aiCategory: 'Transportation',
    aiSentiment: 'Negative',
    isRepeat: true,
    repeatCount: 5,
  },
  {
    id: 'cmp-008',
    studentId: 'stu-004',
    studentName: 'Sneha Patel',
    title: 'No CCTV coverage near parking area',
    description: 'The student parking area near Block D has no CCTV cameras. Two incidents of vehicle damage were reported last week. Installing cameras would deter such incidents.',
    category: 'Safety & Security',
    priority: 'High',
    status: 'Pending',
    date: '2026-10-28',
    adminResponse: null,
    aiCategory: 'Safety & Security',
    aiSentiment: 'Negative',
    isRepeat: false,
    repeatCount: 1,
  },
];

// ── Sample Feedback ────────────────────────────────────────
export const INITIAL_FEEDBACK = [
  {
    id: 'fb-001',
    studentId: 'stu-001',
    studentName: 'Aarav Mehta',
    text: 'The new faculty members in the CS department are excellent. Their teaching style is very practical and industry-oriented.',
    date: '2026-10-18',
    aiSentiment: 'Positive',
    aiKeywords: ['faculty', 'teaching', 'practical', 'industry'],
  },
  {
    id: 'fb-002',
    studentId: 'stu-002',
    studentName: 'Priya Sharma',
    text: 'The examination hall air conditioning is completely broken. Sitting for a 3-hour exam in 35°C heat is unbearable and affects performance.',
    date: '2026-10-20',
    aiSentiment: 'Negative',
    aiKeywords: ['examination', 'air conditioning', 'heat', 'performance'],
  },
  {
    id: 'fb-003',
    studentId: 'stu-003',
    studentName: 'Ravi Kumar',
    text: 'Overall campus life is decent. Some facilities are good, others need improvement. The administration could be more responsive.',
    date: '2026-10-22',
    aiSentiment: 'Neutral',
    aiKeywords: ['facilities', 'administration', 'responsive', 'improvement'],
  },
  {
    id: 'fb-004',
    studentId: 'stu-004',
    studentName: 'Sneha Patel',
    text: 'The annual fest was amazing! The organizing committee did a fantastic job. Looking forward to more such events.',
    date: '2026-10-25',
    aiSentiment: 'Positive',
    aiKeywords: ['fest', 'organizing', 'events', 'amazing'],
  },
  {
    id: 'fb-005',
    studentId: 'stu-001',
    studentName: 'Aarav Mehta',
    text: "Placement cell should improve their communication. Students often don't receive timely updates about drive schedules.",
    date: '2026-10-26',
    aiSentiment: 'Negative',
    aiKeywords: ['placement', 'communication', 'updates', 'schedules'],
  },
];

// ── Analytics Summary ──────────────────────────────────────
export const ANALYTICS_DATA = {
  complaintsByCategory: [
    { name: 'Wi-Fi',        value: 12 },
    { name: 'Cafeteria',    value: 18 },
    { name: 'Hostel',       value: 9  },
    { name: 'Library',      value: 7  },
    { name: 'Transport',    value: 11 },
    { name: 'Safety',       value: 6  },
    { name: 'Academic',     value: 8  },
    { name: 'Sports',       value: 5  },
  ],
  complaintsByMonth: [
    { month: 'May',  complaints: 14, resolved: 10 },
    { month: 'Jun',  complaints: 18, resolved: 15 },
    { month: 'Jul',  complaints: 11, resolved: 9  },
    { month: 'Aug',  complaints: 22, resolved: 16 },
    { month: 'Sep',  complaints: 27, resolved: 20 },
    { month: 'Oct',  complaints: 31, resolved: 18 },
  ],
  sentimentBreakdown: [
    { name: 'Positive', value: 35, color: '#10b981' },
    { name: 'Neutral',  value: 25, color: '#94a3b8' },
    { name: 'Negative', value: 40, color: '#ef4444' },
  ],
  statusBreakdown: [
    { name: 'Pending',    value: 18 },
    { name: 'In Progress',value: 8  },
    { name: 'Resolved',   value: 22 },
  ],
  topIssues: [
    { issue: 'Cafeteria food quality',       count: 18, category: 'Cafeteria / Food'      },
    { issue: 'Wi-Fi connectivity problems',  count: 12, category: 'Wi-Fi / Technology'    },
    { issue: 'Campus bus service',           count: 11, category: 'Transportation'         },
    { issue: 'Library timing',               count: 9,  category: 'Library'               },
    { issue: 'Water supply issues',          count: 8,  category: 'Hostel / Accommodation' },
  ],
};

// ── AI: Simulated sentiment logic ─────────────────────────
const NEGATIVE_KEYWORDS = ['broken','bad','terrible','awful','poor','worst','dirty','unhygienic','no water','no wifi','not working','unfair','disappointing','failed','late','missing','absent'];
const POSITIVE_KEYWORDS = ['great','excellent','amazing','good','appreciate','fantastic','helpful','improved','best','wonderful','happy','satisfied','love','thank'];

export function simulateSentiment(text) {
  const lower = text.toLowerCase();
  const negScore = NEGATIVE_KEYWORDS.filter(k => lower.includes(k)).length;
  const posScore = POSITIVE_KEYWORDS.filter(k => lower.includes(k)).length;
  if (posScore > negScore) return 'Positive';
  if (negScore > posScore) return 'Negative';
  return 'Neutral';
}

export function simulateCategory(text) {
  const lower = text.toLowerCase();
  if (/wifi|wi-fi|internet|network|connectivity/i.test(lower))         return 'Wi-Fi / Technology';
  if (/food|cafeteria|canteen|mess|lunch|dinner|breakfast/i.test(lower)) return 'Cafeteria / Food';
  if (/hostel|room|accommodation|dorm|water|tap/i.test(lower))         return 'Hostel / Accommodation';
  if (/library|book|reading|study hall/i.test(lower))                  return 'Library';
  if (/bus|transport|shuttle|vehicle/i.test(lower))                    return 'Transportation';
  if (/security|cctv|camera|safety|theft|crime/i.test(lower))         return 'Safety & Security';
  if (/sports|gym|fitness|court|field/i.test(lower))                  return 'Sports & Fitness';
  if (/lecture|class|professor|faculty|exam|course/i.test(lower))     return 'Academic';
  if (/road|building|construction|lab|equipment/i.test(lower))        return 'Infrastructure';
  if (/fee|registration|certificate|admin/i.test(lower))              return 'Administration';
  return 'Other';
}

export function extractKeywords(text) {
  const stopWords = new Set(['the','is','are','was','were','a','an','and','or','but','in','on','at','to','for','of','with','it','this','that','i','we','our','you','they','have','had','has','be','been','being','from','by','not','no','so','do','did','can','could','would','should','will','just','very','also','more','most','some','all','any','about','than','then','now','when','where','what','which','who','how','its','as','my','your','his','her','their','them','he','she','me','us','if','else','because','since','while','after','before','during','into','out','up','down','over','under','again','still','too','each','both','other','much','many','such','even','only','own','new']);
  return text.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(' ')
    .filter(w => w.length > 3 && !stopWords.has(w))
    .slice(0, 6);
}
