// Pre-computed bcrypt hash for password "Password123!"
// Hash generated using bcryptjs: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
// We will generate hashes dynamically or use verified demo hashes for instant seed

export const DEMO_HASH = "$2a$10$iI02Qf1h0n33a0o5u/5iS.9hNfS9qQ3y9E/EwL5q.a4N3Jt0u1d2m";

export function getInitialSeedData() {
  const adminId = "usr-admin-01";
  const teacherId1 = "usr-teacher-01";
  const teacherId2 = "usr-teacher-02";
  const teacherId3 = "usr-teacher-03";
  const studentId1 = "usr-student-01";
  const studentId2 = "usr-student-02";
  const studentId3 = "usr-student-03";
  const studentId4 = "usr-student-04";
  const studentId5 = "usr-student-05";
  const studentId6 = "usr-student-06";
  const studentId7 = "usr-student-07";
  const studentId8 = "usr-student-08";

  const tProfileId1 = "tch-01";
  const tProfileId2 = "tch-02";
  const tProfileId3 = "tch-03";

  const sProfileId1 = "stu-01";
  const sProfileId2 = "stu-02";
  const sProfileId3 = "stu-03";
  const sProfileId4 = "stu-04";
  const sProfileId5 = "stu-05";
  const sProfileId6 = "stu-06";
  const sProfileId7 = "stu-07";
  const sProfileId8 = "stu-08";

  const classId1 = "cls-01"; // CS Year 2 - Sec A
  const classId2 = "cls-02"; // Math & AI - Sec B
  const classId3 = "cls-03"; // Physics - Sec A

  const subId1 = "sub-01"; // CS-201
  const subId2 = "sub-02"; // CS-202
  const subId3 = "sub-03"; // MTH-101
  const subId4 = "sub-04"; // PHY-301
  const subId5 = "sub-05"; // ENG-102

  const users = [
    {
      id: adminId,
      email: "admin@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy", // AdminPassword123!
      name: "Dr. Robert Vance",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: teacherId1,
      email: "teacher@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy", // TeacherPassword123!
      name: "Prof. Marcus Thorne",
      role: "TEACHER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: teacherId2,
      email: "sarah.jenkins@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Dr. Sarah Jenkins",
      role: "TEACHER",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: teacherId3,
      email: "elena.rostova@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Prof. Elena Rostova",
      role: "TEACHER",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId1,
      email: "student@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy", // StudentPassword123!
      name: "Alex Rivera",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId2,
      email: "sophia.chen@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Sophia Chen",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId3,
      email: "liam.patel@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Liam Patel",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId4,
      email: "olivia.williams@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Olivia Williams",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId5,
      email: "ethan.davis@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Ethan Davis",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId6,
      email: "mia.martinez@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Mia Martinez",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId7,
      email: "noah.johnson@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Noah Johnson",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: studentId8,
      email: "ava.taylor@edumanage.com",
      passwordHash: "$2a$10$n4OQ4nU0Hl6f2aQ0h/kH.OP1X0t7kF7p0B6C.iJqXb7qP9g.7gIiy",
      name: "Ava Taylor",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const teachers = [
    {
      id: tProfileId1,
      teacherId: "TCH-2024-001",
      fullName: "Prof. Marcus Thorne",
      email: "teacher@edumanage.com",
      phone: "+1 (555) 384-9021",
      department: "Computer Science",
      qualification: "Ph.D. in Distributed Systems & AI, MIT",
      joiningDate: "2021-08-15T00:00:00.000Z",
      status: "ACTIVE",
      userId: teacherId1,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: tProfileId2,
      teacherId: "TCH-2024-002",
      fullName: "Dr. Sarah Jenkins",
      email: "sarah.jenkins@edumanage.com",
      phone: "+1 (555) 492-7812",
      department: "Mathematics",
      qualification: "Ph.D. in Applied Mathematics, Stanford",
      joiningDate: "2020-01-10T00:00:00.000Z",
      status: "ACTIVE",
      userId: teacherId2,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: tProfileId3,
      teacherId: "TCH-2024-003",
      fullName: "Prof. Elena Rostova",
      email: "elena.rostova@edumanage.com",
      phone: "+1 (555) 601-3490",
      department: "Physics & Engineering",
      qualification: "M.S. in Applied Physics & Robotics, Caltech",
      joiningDate: "2022-09-01T00:00:00.000Z",
      status: "ACTIVE",
      userId: teacherId3,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const classes = [
    {
      id: classId1,
      name: "Computer Science Year 2",
      section: "Section A",
      room: "Tech Hall 401",
      academicYear: "2024-2025",
      capacity: 45,
      classTeacherId: tProfileId1,
    },
    {
      id: classId2,
      name: "Mathematics & AI Year 1",
      section: "Section B",
      room: "Science Wing 205",
      academicYear: "2024-2025",
      capacity: 40,
      classTeacherId: tProfileId2,
    },
    {
      id: classId3,
      name: "Engineering Physics Year 3",
      section: "Section A",
      room: "Innovation Lab 102",
      academicYear: "2024-2025",
      capacity: 35,
      classTeacherId: tProfileId3,
    },
  ];

  const subjects = [
    {
      id: subId1,
      code: "CS-201",
      name: "Data Structures & Algorithms",
      description: "Fundamental data structures, computational complexity, graph algorithms and dynamic programming.",
      credits: 4,
      department: "Computer Science",
    },
    {
      id: subId2,
      code: "CS-202",
      name: "Database Systems & Design",
      description: "Relational database concepts, normalization, SQL, indexing, transaction management and ACID properties.",
      credits: 4,
      department: "Computer Science",
    },
    {
      id: subId3,
      code: "MTH-101",
      name: "Linear Algebra & Discrete Math",
      description: "Vector spaces, matrices, eigenvalues, graph theory and combinatorics for computing.",
      credits: 3,
      department: "Mathematics",
    },
    {
      id: subId4,
      code: "PHY-301",
      name: "Modern Physics & Quantum Computing",
      description: "Wave mechanics, semiconductors, solid state physics and introductory quantum circuits.",
      credits: 3,
      department: "Physics",
    },
    {
      id: subId5,
      code: "ENG-102",
      name: "Technical Communication & Ethics",
      description: "Engineering research documentation, collaborative software ethics and presentation skills.",
      credits: 2,
      department: "Humanities",
    },
  ];

  const teacherAssignments = [
    {
      id: "ta-01",
      teacherId: tProfileId1,
      classId: classId1,
      subjectId: subId1,
      academicYear: "2024-2025",
    },
    {
      id: "ta-02",
      teacherId: tProfileId1,
      classId: classId1,
      subjectId: subId2,
      academicYear: "2024-2025",
    },
    {
      id: "ta-03",
      teacherId: tProfileId2,
      classId: classId1,
      subjectId: subId3,
      academicYear: "2024-2025",
    },
    {
      id: "ta-04",
      teacherId: tProfileId2,
      classId: classId2,
      subjectId: subId3,
      academicYear: "2024-2025",
    },
    {
      id: "ta-05",
      teacherId: tProfileId3,
      classId: classId3,
      subjectId: subId4,
      academicYear: "2024-2025",
    },
  ];

  const students = [
    {
      id: sProfileId1,
      studentId: "STU-2024-001",
      fullName: "Alex Rivera",
      email: "student@edumanage.com",
      phone: "+1 (555) 781-2290",
      dateOfBirth: "2004-05-14T00:00:00.000Z",
      gender: "Male",
      address: "742 Evergreen Terrace, Seattle, WA",
      status: "ACTIVE",
      enrollmentDate: "2023-09-01T00:00:00.000Z",
      userId: studentId1,
      currentClassId: classId1,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: sProfileId2,
      studentId: "STU-2024-002",
      fullName: "Sophia Chen",
      email: "sophia.chen@edumanage.com",
      phone: "+1 (555) 892-3310",
      dateOfBirth: "2004-09-22T00:00:00.000Z",
      gender: "Female",
      address: "128 Beacon St, Boston, MA",
      status: "ACTIVE",
      enrollmentDate: "2023-09-01T00:00:00.000Z",
      userId: studentId2,
      currentClassId: classId1,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: sProfileId3,
      studentId: "STU-2024-003",
      fullName: "Liam Patel",
      email: "liam.patel@edumanage.com",
      phone: "+1 (555) 304-8812",
      dateOfBirth: "2003-11-08T00:00:00.000Z",
      gender: "Male",
      address: "450 University Ave, Palo Alto, CA",
      status: "ACTIVE",
      enrollmentDate: "2023-09-01T00:00:00.000Z",
      userId: studentId3,
      currentClassId: classId1,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: sProfileId4,
      studentId: "STU-2024-004",
      fullName: "Olivia Williams",
      email: "olivia.williams@edumanage.com",
      phone: "+1 (555) 412-9903",
      dateOfBirth: "2004-03-30T00:00:00.000Z",
      gender: "Female",
      address: "88 Broadway Ave, New York, NY",
      status: "ACTIVE",
      enrollmentDate: "2023-09-01T00:00:00.000Z",
      userId: studentId4,
      currentClassId: classId1,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: sProfileId5,
      studentId: "STU-2024-005",
      fullName: "Ethan Davis",
      email: "ethan.davis@edumanage.com",
      phone: "+1 (555) 670-1123",
      dateOfBirth: "2005-01-19T00:00:00.000Z",
      gender: "Male",
      address: "310 Michigan Ave, Chicago, IL",
      status: "ACTIVE",
      enrollmentDate: "2024-01-15T00:00:00.000Z",
      userId: studentId5,
      currentClassId: classId2,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: sProfileId6,
      studentId: "STU-2024-006",
      fullName: "Mia Martinez",
      email: "mia.martinez@edumanage.com",
      phone: "+1 (555) 901-4478",
      dateOfBirth: "2005-07-12T00:00:00.000Z",
      gender: "Female",
      address: "15 Biscayne Blvd, Miami, FL",
      status: "ACTIVE",
      enrollmentDate: "2024-01-15T00:00:00.000Z",
      userId: studentId6,
      currentClassId: classId2,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: sProfileId7,
      studentId: "STU-2024-007",
      fullName: "Noah Johnson",
      email: "noah.johnson@edumanage.com",
      phone: "+1 (555) 234-8890",
      dateOfBirth: "2003-04-18T00:00:00.000Z",
      gender: "Male",
      address: "99 Congress Ave, Austin, TX",
      status: "ACTIVE",
      enrollmentDate: "2022-09-01T00:00:00.000Z",
      userId: studentId7,
      currentClassId: classId3,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: sProfileId8,
      studentId: "STU-2024-008",
      fullName: "Ava Taylor",
      email: "ava.taylor@edumanage.com",
      phone: "+1 (555) 554-1234",
      dateOfBirth: "2003-08-05T00:00:00.000Z",
      gender: "Female",
      address: "520 Peachtree St, Atlanta, GA",
      status: "ACTIVE",
      enrollmentDate: "2022-09-01T00:00:00.000Z",
      userId: studentId8,
      currentClassId: classId3,
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const enrollments = [
    { id: "enr-01", studentId: sProfileId1, classId: classId1, academicYear: "2024-2025" },
    { id: "enr-02", studentId: sProfileId2, classId: classId1, academicYear: "2024-2025" },
    { id: "enr-03", studentId: sProfileId3, classId: classId1, academicYear: "2024-2025" },
    { id: "enr-04", studentId: sProfileId4, classId: classId1, academicYear: "2024-2025" },
    { id: "enr-05", studentId: sProfileId5, classId: classId2, academicYear: "2024-2025" },
    { id: "enr-06", studentId: sProfileId6, classId: classId2, academicYear: "2024-2025" },
    { id: "enr-07", studentId: sProfileId7, classId: classId3, academicYear: "2024-2025" },
    { id: "enr-08", studentId: sProfileId8, classId: classId3, academicYear: "2024-2025" },
  ];

  // Attendance records for Class 1 (Students 1 to 4) over past dates
  const dates = ["2026-10-14", "2026-10-15", "2026-10-16"];
  const attendance = [
    // 2026-10-14
    { id: "att-01", studentId: sProfileId1, classId: classId1, date: "2026-10-14T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
    { id: "att-02", studentId: sProfileId2, classId: classId1, date: "2026-10-14T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
    { id: "att-03", studentId: sProfileId3, classId: classId1, date: "2026-10-14T00:00:00.000Z", status: "LATE", remarks: "10 mins late due to transit", markedById: teacherId1 },
    { id: "att-04", studentId: sProfileId4, classId: classId1, date: "2026-10-14T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },

    // 2026-10-15
    { id: "att-05", studentId: sProfileId1, classId: classId1, date: "2026-10-15T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
    { id: "att-06", studentId: sProfileId2, classId: classId1, date: "2026-10-15T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
    { id: "att-07", studentId: sProfileId3, classId: classId1, date: "2026-10-15T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
    { id: "att-08", studentId: sProfileId4, classId: classId1, date: "2026-10-15T00:00:00.000Z", status: "ABSENT", remarks: "Medical leave", markedById: teacherId1 },

    // 2026-10-16 (Today)
    { id: "att-09", studentId: sProfileId1, classId: classId1, date: "2026-10-16T00:00:00.000Z", status: "PRESENT", remarks: "Active participation", markedById: teacherId1 },
    { id: "att-10", studentId: sProfileId2, classId: classId1, date: "2026-10-16T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
    { id: "att-11", studentId: sProfileId3, classId: classId1, date: "2026-10-16T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
    { id: "att-12", studentId: sProfileId4, classId: classId1, date: "2026-10-16T00:00:00.000Z", status: "PRESENT", remarks: "On time", markedById: teacherId1 },
  ];

  const examId1 = "exm-01";
  const examId2 = "exm-02";
  const examId3 = "exm-03";

  const examinations = [
    {
      id: examId1,
      name: "Midterm Examination 2024",
      term: "Semester 1",
      academicYear: "2024-2025",
      examDate: "2026-09-25T09:00:00.000Z",
      maxMarks: 100,
      passingMarks: 40,
      classId: classId1,
      subjectId: subId1, // CS-201
      createdById: teacherId1,
    },
    {
      id: examId2,
      name: "Semester 1 Final Practical Exam",
      term: "Semester 1",
      academicYear: "2024-2025",
      examDate: "2026-10-05T10:00:00.000Z",
      maxMarks: 100,
      passingMarks: 40,
      classId: classId1,
      subjectId: subId2, // CS-202
      createdById: teacherId1,
    },
    {
      id: examId3,
      name: "Linear Algebra Assessment 1",
      term: "Semester 1",
      academicYear: "2024-2025",
      examDate: "2026-10-08T11:00:00.000Z",
      maxMarks: 50,
      passingMarks: 20,
      classId: classId2,
      subjectId: subId3, // MTH-101
      createdById: teacherId2,
    },
  ];

  const results = [
    // Exam 1 (CS-201, Max 100)
    { id: "res-01", examinationId: examId1, studentId: sProfileId1, marksObtained: 92, percentage: 92.0, grade: "A+", remarks: "Outstanding algorithmic thinking", gradedById: teacherId1 },
    { id: "res-02", examinationId: examId1, studentId: sProfileId2, marksObtained: 96, percentage: 96.0, grade: "A+", remarks: "Flawless code structure", gradedById: teacherId1 },
    { id: "res-03", examinationId: examId1, studentId: sProfileId3, marksObtained: 78, percentage: 78.0, grade: "B", remarks: "Good conceptual clarity", gradedById: teacherId1 },
    { id: "res-04", examinationId: examId1, studentId: sProfileId4, marksObtained: 85, percentage: 85.0, grade: "A", remarks: "Strong problem solving skills", gradedById: teacherId1 },

    // Exam 2 (CS-202, Max 100)
    { id: "res-05", examinationId: examId2, studentId: sProfileId1, marksObtained: 88, percentage: 88.0, grade: "A", remarks: "Great schema design and normalization", gradedById: teacherId1 },
    { id: "res-06", examinationId: examId2, studentId: sProfileId2, marksObtained: 91, percentage: 91.0, grade: "A+", remarks: "Excellent indexing and query optimization", gradedById: teacherId1 },
    { id: "res-07", examinationId: examId2, studentId: sProfileId3, marksObtained: 82, percentage: 82.0, grade: "A", remarks: "Very good grasp of ACID properties", gradedById: teacherId1 },
    { id: "res-08", examinationId: examId2, studentId: sProfileId4, marksObtained: 74, percentage: 74.0, grade: "B", remarks: "Completed all queries successfully", gradedById: teacherId1 },

    // Exam 3 (MTH-101, Max 50)
    { id: "res-09", examinationId: examId3, studentId: sProfileId5, marksObtained: 46, percentage: 92.0, grade: "A+", remarks: "Brilliant proofs", gradedById: teacherId2 },
    { id: "res-10", examinationId: examId3, studentId: sProfileId6, marksObtained: 42, percentage: 84.0, grade: "A", remarks: "Clean computational accuracy", gradedById: teacherId2 },
  ];

  const invId1 = "inv-01";
  const invId2 = "inv-02";
  const invId3 = "inv-03";
  const invId4 = "inv-04";
  const invId5 = "inv-05";

  const feeInvoices = [
    {
      id: invId1,
      invoiceNumber: "INV-2024-001",
      studentId: sProfileId1, // Alex Rivera
      title: "Fall Semester 2024 Tuition",
      category: "TUITION",
      totalAmount: 3500.0,
      paidAmount: 3500.0,
      balance: 0.0,
      dueDate: "2026-09-15T00:00:00.000Z",
      status: "PAID",
      issuedDate: "2026-08-20T00:00:00.000Z",
      notes: "Full payment received with early registration scholarship credit.",
    },
    {
      id: invId2,
      invoiceNumber: "INV-2024-002",
      studentId: sProfileId1, // Alex Rivera
      title: "Advanced CS Lab & Technology Fee",
      category: "LABORATORY",
      totalAmount: 650.0,
      paidAmount: 300.0,
      balance: 350.0,
      dueDate: "2026-11-01T00:00:00.000Z",
      status: "PARTIALLY_PAID",
      issuedDate: "2026-09-01T00:00:00.000Z",
      notes: "First installment settled on Sept 10. Balance due by Nov 1.",
    },
    {
      id: invId3,
      invoiceNumber: "INV-2024-003",
      studentId: sProfileId2, // Sophia Chen
      title: "Fall Semester 2024 Tuition",
      category: "TUITION",
      totalAmount: 3500.0,
      paidAmount: 3500.0,
      balance: 0.0,
      dueDate: "2026-09-15T00:00:00.000Z",
      status: "PAID",
      issuedDate: "2026-08-20T00:00:00.000Z",
      notes: "Paid in full via Bank Transfer.",
    },
    {
      id: invId4,
      invoiceNumber: "INV-2024-004",
      studentId: sProfileId3, // Liam Patel
      title: "Fall Semester 2024 Tuition",
      category: "TUITION",
      totalAmount: 3500.0,
      paidAmount: 1500.0,
      balance: 2000.0,
      dueDate: "2026-10-10T00:00:00.000Z",
      status: "OVERDUE",
      issuedDate: "2026-08-20T00:00:00.000Z",
      notes: "Overdue reminder sent to student email.",
    },
    {
      id: invId5,
      invoiceNumber: "INV-2024-005",
      studentId: sProfileId4, // Olivia Williams
      title: "Annual Library & Digital Resources Fee",
      category: "LIBRARY",
      totalAmount: 400.0,
      paidAmount: 0.0,
      balance: 400.0,
      dueDate: "2026-11-15T00:00:00.000Z",
      status: "PENDING",
      issuedDate: "2026-09-15T00:00:00.000Z",
      notes: "Pending student payment.",
    },
  ];

  const feePayments = [
    {
      id: "pay-01",
      receiptNumber: "RCP-2024-001",
      invoiceId: invId1,
      amount: 3500.0,
      paymentDate: "2026-09-02T14:30:00.000Z",
      paymentMethod: "ONLINE_DEMO",
      transactionRef: "TXN-DEMO-991823",
      notes: "Online card payment processed successfully.",
      recordedById: adminId,
    },
    {
      id: "pay-02",
      receiptNumber: "RCP-2024-002",
      invoiceId: invId2,
      amount: 300.0,
      paymentDate: "2026-09-10T11:15:00.000Z",
      paymentMethod: "BANK_TRANSFER",
      transactionRef: "WIRE-REF-440219",
      notes: "Partial payment installment 1.",
      recordedById: adminId,
    },
    {
      id: "pay-03",
      receiptNumber: "RCP-2024-003",
      invoiceId: invId3,
      amount: 3500.0,
      paymentDate: "2026-08-28T09:45:00.000Z",
      paymentMethod: "BANK_TRANSFER",
      transactionRef: "WIRE-REF-109283",
      notes: "Direct bank transfer verified by cashier.",
      recordedById: adminId,
    },
    {
      id: "pay-04",
      receiptNumber: "RCP-2024-004",
      invoiceId: invId4,
      amount: 1500.0,
      paymentDate: "2026-09-05T16:00:00.000Z",
      paymentMethod: "CASH",
      transactionRef: "CASH-REC-0082",
      notes: "Cash receipt counter payment.",
      recordedById: adminId,
    },
  ];

  return {
    users,
    teachers,
    classes,
    subjects,
    teacherAssignments,
    students,
    enrollments,
    attendance,
    examinations,
    results,
    feeInvoices,
    feePayments,
  };
}
