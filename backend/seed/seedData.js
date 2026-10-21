const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Book = require('../models/Book');
const Resource = require('../models/Resource');
const Inquiry = require('../models/Inquiry');
const Review = require('../models/Review');

dotenv.config({ path: __dirname + '/../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lithaven';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`[Seeder] Connected to MongoDB at ${MONGODB_URI}`);

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      Resource.deleteMany({}),
      Inquiry.deleteMany({}),
      Review.deleteMany({})
    ]);
    console.log('[Seeder] Cleared previous collections');

    // Create Demo Student Personas
    const usersData = [
      {
        name: 'Aanya Sharma',
        email: 'aanya@lithaven.edu',
        password: 'password123',
        college: 'Oxford University / IIT Delhi',
        department: 'Quantum Computing & Neural Systems',
        year: '3rd Year',
        phone: '+91 98765 43210',
        bio: 'Computational physicist and algorithmic researcher. Curating cutting-edge manuscripts and university textbooks for the next batch.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 16
      },
      {
        name: 'Dr. Marcus Vance',
        email: 'marcus@lithaven.edu',
        password: 'password123',
        college: 'Johns Hopkins / AIIMS',
        department: 'Genomic Oncology & Bio-Engineering',
        year: 'Final Year',
        phone: '+91 98111 22334',
        bio: 'Clinical resident in molecular medicine. Passing down foundational anatomy volumes, genomic atlases, and high-yield oncology compendiums.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewCount: 12
      },
      {
        name: 'Sophia Chen',
        email: 'sophia@lithaven.edu',
        password: 'password123',
        college: 'Columbia / SRCC',
        department: 'Quantitative Finance & Macroeconomics',
        year: '2nd Year',
        phone: '+91 97234 56789',
        bio: 'Algorithmic trading researcher and econometrics aficionado. Sharing pristine institutional finance monographs.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviewCount: 9
      },
      {
        name: 'Rohan Deshmukh',
        email: 'rohan@lithaven.edu',
        password: 'password123',
        college: 'MIT / BITS Pilani',
        department: 'Cybernetics & Autonomous Robotics',
        year: 'Final Year',
        phone: '+91 91234 98765',
        bio: 'Roboticist and topologist. Selling core mathematical texts and hardware engineering volumes in pristine condition.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 14
      }
    ];

    const users = await User.create(usersData);
    console.log(`[Seeder] Created ${users.length} scholar personas`);

    const [u1, u2, u3, u4] = users;

    // Create 16 Bespoke Curated Academic & Engineering Books
    const booksData = [
      {
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        description: 'The globally revered standard algorithms reference textbook. Comprehensive analysis of sorting, data structures, dynamic programming, greedy algorithms, graph theory, NP-completeness, and multithreaded algorithms with rigorous proofs.',
        isbn: '978-0262046305',
        edition: '4th International Edition',
        price: 620,
        originalPrice: 1850,
        condition: 'Like New',
        category: 'Computer Science & AI',
        subject: 'Data Structures & Algorithms',
        semester: 'Semester 3 & 4',
        coverImage: '/covers/cover_algorithms.jpg',
        images: ['/covers/cover_algorithms.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Pristine unmarked pages, zero pencil notes, includes algorithm pseudocode quick-sheet.',
        status: 'available',
        owner: u1._id,
        campusLocation: 'IIT Delhi / Bharti School of Telecom & AI',
        views: 1000,
        wishlistCount: 88,
        featured: true
      },
      {
        title: 'Pattern Recognition and Machine Learning (PRML)',
        author: 'Christopher M. Bishop',
        description: 'The definitive graduate-level reference for pattern recognition and machine learning from a Bayesian perspective. In-depth coverage of graphical models, variational inference, EM algorithm, kernel methods, and Gaussian processes.',
        isbn: '978-0387310732',
        edition: 'First Hardcover Library Edition',
        price: 580,
        originalPrice: 1750,
        condition: 'Like New',
        category: 'Computer Science & AI',
        subject: 'Machine Learning & Bayesian Inference',
        semester: 'Semester 5 & 6',
        coverImage: '/covers/cover_bishop_ml.jpg',
        images: ['/covers/cover_bishop_ml.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Spotless hardcover with gold foil spine, flawless color diagram plates, zero markings.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'IIIT Hyderabad / Nilgiri Foyer',
        views: 980,
        wishlistCount: 82,
        featured: true
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin ("Uncle Bob")',
        description: 'Legendary craftsmanship guide on transforming bad code into resilient software. Covers meaningful naming, SOLID design principles, function boundaries, error handling, TDD, and systematic code smell refactoring.',
        isbn: '978-0132350884',
        edition: 'Prentice Hall Classic Craftsman Edition',
        price: 450,
        originalPrice: 1300,
        condition: 'Like New',
        category: 'Computer Science & AI',
        subject: 'Software Engineering & Architecture',
        semester: 'Semester 4 & 5',
        coverImage: '/covers/cover_clean_code.jpg',
        images: ['/covers/cover_clean_code.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Clean white pages, crisp corners, no highlighting or annotations.',
        status: 'available',
        owner: u1._id,
        campusLocation: 'DTU / Central Library Quad',
        views: 960,
        wishlistCount: 78,
        featured: true
      },
      {
        title: 'GATE Computer Science & IT: Previous 25 Years Solved Papers & Comprehensive Guide',
        author: 'Made Easy Editorial Board',
        description: 'Complete syllabus coverage for GATE CSE/IT & PSU recruitment. Topic-wise solved previous papers with in-depth explanations across discrete math, TOC, compiler design, OS, DBMS, and CN.',
        isbn: '978-9351478201',
        edition: '25-Year Solved Comprehensive Edition',
        price: 480,
        originalPrice: 1400,
        condition: 'Like New',
        category: 'Competitive Exams',
        subject: 'GATE CSE & PSU Technical Entrance',
        semester: 'GATE Aspirants & Final Year',
        coverImage: '/covers/cover_competitive_exams.jpg',
        images: ['/covers/cover_competitive_exams.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Pristine unmarked pages and problem sets with formula quick-revision booklet.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'NIT Trichy / Main Academic Complex',
        views: 940,
        wishlistCount: 74,
        featured: true
      },
      {
        title: 'Cracking the Coding Interview & Technical Prep Blueprint',
        author: 'Gayle Laakmann McDowell',
        description: '189 programming questions and solutions, from big-O fundamentals to intricate algorithm challenges. Includes step-by-step frameworks for cracking Google, Microsoft, Amazon, and campus placement rounds.',
        isbn: '978-0984782857',
        edition: '6th Expanded Placement Edition',
        price: 520,
        originalPrice: 1550,
        condition: 'Like New',
        category: 'Interview Preparation & Coding',
        subject: 'Technical Interviews & SDE Placements',
        semester: 'Semester 6 & 7',
        coverImage: '/covers/cover_interview_prep.jpg',
        images: ['/covers/cover_interview_prep.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Crisp margins, unmarked problem walkthroughs, includes quick complexity lookup sheet.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'IIIT Hyderabad / Nilgiri Foyer',
        views: 920,
        wishlistCount: 71,
        featured: true
      },
      {
        title: 'Machine Learning: A Probabilistic Perspective',
        author: 'Kevin P. Murphy',
        description: 'Comprehensive, unified introduction to machine learning using probabilistic methods. Complete mathematical and algorithmic treatment of generative models, Bayesian neural networks, Monte Carlo methods, and deep learning.',
        isbn: '978-0262018029',
        edition: 'Adaptive Computation and Machine Learning Series',
        price: 650,
        originalPrice: 1950,
        condition: 'Like New',
        category: 'Computer Science & AI',
        subject: 'Probabilistic AI & Machine Learning',
        semester: 'Semester 6 & 7',
        coverImage: '/covers/cover_machine_learning.jpg',
        images: ['/covers/cover_machine_learning.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Flawless cloth hardcover with clean pages, full color plates, and complete code walkthrough appendices.',
        status: 'available',
        owner: u1._id,
        campusLocation: 'IIT Bombay / Central Library',
        views: 900,
        wishlistCount: 68,
        featured: true
      },
      {
        title: 'Operating Systems: Three Easy Pieces & Internal Principles',
        author: 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
        description: 'The most intuitive, beloved operating systems text worldwide. Explores virtualization (CPU and memory), concurrency (threads, locks, semaphores), and persistence (file systems, RAID, crash consistency).',
        isbn: '978-1985086593',
        edition: 'Version 1.0 Hardcover Edition',
        price: 490,
        originalPrice: 1450,
        condition: 'Like New',
        category: 'Computer Science & AI',
        subject: 'Operating Systems & Concurrency',
        semester: 'Semester 4 & 5',
        coverImage: '/covers/cover_operating_systems.jpg',
        images: ['/covers/cover_operating_systems.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Immaculate condition with all concurrency diagrams clear and crisp, zero annotations.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'DTU / CSE Department Library',
        views: 880,
        wishlistCount: 65,
        featured: true
      },
      {
        title: 'Quantitative Aptitude for Competitive Examinations',
        author: 'Dr. R.S. Aggarwal',
        description: 'The quintessential benchmark manual for campus placements, CAT, UPSC CSAT, Bank PO, and SSC exams. Over 5500 questions with step-by-step shortcuts, speed math tricks, and foundational reasoning methods.',
        isbn: '978-9352534029',
        edition: 'Fully Revised Golden Edition',
        price: 420,
        originalPrice: 1200,
        condition: 'Good',
        category: 'Competitive Exams',
        subject: 'Quantitative Aptitude & Mathematical Reasoning',
        semester: 'All Semesters & Aspirants',
        coverImage: '/covers/cover_quantitative_aptitude.jpg',
        images: ['/covers/cover_quantitative_aptitude.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Pages in very good condition, clean formulas, light cover shelf wear.',
        status: 'available',
        owner: u3._id,
        campusLocation: 'IIT Delhi / Student Activity Center',
        views: 860,
        wishlistCount: 60,
        featured: true
      },
      {
        title: "System Design Interview – An Insider's Guide (Volume 1 & 2)",
        author: 'Alex Xu & Sahn Lam',
        description: 'Visual, step-by-step framework to crack senior engineering and campus system design rounds. Covers rate limiters, distributed key-value stores, chat systems, YouTube video pipeline, and search autocomplete.',
        isbn: '979-8664653403',
        edition: 'Second Collector Edition',
        price: 540,
        originalPrice: 1650,
        condition: 'Like New',
        category: 'Interview Preparation & Coding',
        subject: 'System Architecture & High-Level Design',
        semester: 'Semester 6 & 7',
        coverImage: '/covers/cover_system_design_xu.jpg',
        images: ['/covers/cover_system_design_xu.jpg'],
        conditionNotes: 'Spine Binding: Firm & Intact. Crisp architectural diagrams, clean white pages, includes sample scale calculations cheat sheet.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'IIIT Hyderabad / Nilgiri Foyer',
        views: 450,
        wishlistCount: 45,
        featured: false
      },
      {
        title: 'Quantum Dynamics: A Unified Theory of the Subatomic World',
        author: 'Dr. Adrian Vance',
        description: 'Monumental treatise on quantum wave mechanics, Hilbert spaces, Feynman path integrals, and entanglement topologies. Includes gold-leaf reference charts and end-of-chapter tensor proofs. Pristine condition with immaculate cloth binding.',
        isbn: '978-0199238125',
        edition: 'First Hardcover Library Edition',
        price: 490,
        originalPrice: 1499,
        condition: 'Like New',
        category: 'Natural Sciences & Math',
        subject: 'Quantum Physics & Field Theory',
        semester: 'Semester 4 & 5',
        coverImage: '/covers/cover_quantum.jpg',
        images: ['/covers/cover_quantum.jpg'],
        conditionNotes: 'Flawless hardcover with gold foil embossing and crisp pages.',
        status: 'available',
        owner: u1._id,
        campusLocation: 'Clarendon Physics Laboratory / Central Quad',
        views: 412,
        wishlistCount: 38,
        featured: false
      },
      {
        title: 'Artificial Intelligence: A Modern Approach (4th Global Edition)',
        author: 'Stuart Russell & Peter Norvig',
        description: 'The authoritative, universally acclaimed #1 global textbook in artificial intelligence. Comprehensive coverage of intelligent agents, heuristic search (A*), constraint satisfaction, probabilistic reasoning, machine learning, deep learning, NLP, and AI ethics.',
        isbn: '978-0134610993',
        edition: '4th Global Edition (Pearson)',
        price: 580,
        originalPrice: 1850,
        condition: 'Like New',
        category: 'Computer Science & AI',
        subject: 'Artificial Intelligence, Heuristics & Search',
        semester: 'Semester 5 & 6',
        coverImage: '/covers/cover_ai_russell_norvig.jpg',
        images: ['/covers/cover_ai_russell_norvig.jpg'],
        conditionNotes: 'Pristine hardcover copy with crisp unmarked pages, firm binding, and complete algorithm pseudocode appendices.',
        status: 'available',
        owner: u1._id,
        campusLocation: 'IIT Delhi / Bharti School of Telecom & AI',
        views: 430,
        wishlistCount: 40,
        featured: false
      },
      {
        title: 'Genomic Medicine: Precision Therapeutics & Molecular Oncology',
        author: 'Arthur V. Reed & Sophia L. Chen',
        description: 'The definitive textbook for medical genomics, CRISPR-Cas editing therapeutics, epigenetics, and targeted immunotherapy pathways. Full-color plates and clinical case summaries.',
        isbn: '978-0323483921',
        edition: '3rd Global Clinical Edition',
        price: 540,
        originalPrice: 1650,
        condition: 'Like New',
        category: 'Medical & Healthcare',
        subject: 'Molecular Genetics & Pathology',
        semester: 'Year 2 & 3',
        coverImage: '/covers/cover_genomic.jpg',
        images: ['/covers/cover_genomic.jpg'],
        conditionNotes: 'Hardcover bound with gold gilding. Spotless interior with zero notes.',
        status: 'available',
        owner: u2._id,
        campusLocation: 'Biomedical Research Center Courtyard',
        views: 380,
        wishlistCount: 31,
        featured: false
      },
      {
        title: 'Deep Astrophysics: Exploring the Cosmic Unknown',
        author: 'Dr. Sarah J. Reed & Dr. Mark A. Elias',
        description: 'Spectacular exploration of relativistic stellar evolution, gravitational wave astronomy, black hole magnetospheres, and dark energy cosmological models. Prescribed at Oxford & Cambridge.',
        isbn: '978-0198829412',
        edition: 'Oxford University Press Hardcover',
        price: 420,
        originalPrice: 1250,
        condition: 'Good',
        category: 'Natural Sciences & Math',
        subject: 'Astrophysics & Cosmology',
        semester: 'Semester 3',
        coverImage: '/covers/cover_astrophysics.jpg',
        images: ['/covers/cover_astrophysics.jpg'],
        conditionNotes: 'Spine intact, clean margins, minor corner shelf wear.',
        status: 'available',
        owner: u1._id,
        campusLocation: 'Radcliffe Observatory Lawn',
        views: 295,
        wishlistCount: 24,
        featured: false
      },
      {
        title: 'Quantitative Capital: Finance, Markets & Computational Theories',
        author: 'Dr. Eliza Vance & Prof. Arjun Desai',
        description: 'Master asset pricing dynamics, stochastic calculus, Black-Scholes-Merton PDE derivations, algorithmic liquidity provision, and high-frequency market microstructure.',
        isbn: '978-1119842103',
        edition: '2nd Quantitative Edition',
        price: 460,
        originalPrice: 1350,
        condition: 'Like New',
        category: 'Commerce, Finance & MBA',
        subject: 'Quantitative Finance & Derivatives',
        semester: 'Semester 3',
        coverImage: '/covers/cover_finance.jpg',
        images: ['/covers/cover_finance.jpg'],
        conditionNotes: 'Pristine hardcover copy with unused Bloomberg lab workbook insert.',
        status: 'available',
        owner: u3._id,
        campusLocation: 'Business School Financial Markets Lab',
        views: 310,
        wishlistCount: 29,
        featured: false
      },
      {
        title: 'Control Systems Engineering (9th Edition)',
        author: 'Norman S. Nise',
        description: 'The gold-standard reference for analysis and design of feedback control systems. Covers state-space equations, transfer functions, root locus, frequency response, Bode plots, and robotic PID tuning with MATLAB/Simulink problem sets.',
        isbn: '978-1119772347',
        edition: 'Ninth Edition (John Wiley & Sons)',
        price: 520,
        originalPrice: 1650,
        condition: 'Like New',
        category: 'Engineering & Technology',
        subject: 'Robotics, Control Systems & Mechatronics',
        semester: 'Semester 4 & 5',
        coverImage: '/covers/cover_control_systems_nise.jpg',
        images: ['/covers/cover_control_systems_nise.jpg'],
        conditionNotes: 'Hardcover textbook in immaculate condition with full circuit schematics, feedback diagrams, and clean problem sets.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'DTU / Robotics & Automation Centre',
        views: 350,
        wishlistCount: 30,
        featured: false
      },
      {
        title: 'Ethical Jurisprudence: Legal Philosophy and the Rule of Law',
        author: 'Aaron J. Vance',
        description: 'Profound philosophical interrogation of constitutional design, natural law versus legal positivism, rights ethics in synthetic intelligence, and global human rights treaties.',
        isbn: '978-0199582103',
        edition: 'Oxford University Press Library Bound',
        price: 390,
        originalPrice: 1150,
        condition: 'Like New',
        category: 'Law & Legal Studies',
        subject: 'Jurisprudence & Constitutional Law',
        semester: 'Year 2',
        coverImage: '/covers/cover_jurisprudence.jpg',
        images: ['/covers/cover_jurisprudence.jpg'],
        conditionNotes: 'Beautiful Carrara marble finish cover with gold foil accents.',
        status: 'available',
        owner: u3._id,
        campusLocation: 'Law Faculty Library Garden',
        views: 230,
        wishlistCount: 19,
        featured: false
      },
      {
        title: 'Algebraic Topology: Homotopy Theory & Differential Manifolds',
        author: 'Alan Hatcher & Elias M. Stein',
        description: 'The legendary standard on fundamental groups, covering spaces, simplicial homology, cohomology rings, Poincaré duality, and fiber bundles with geometric illustrations.',
        isbn: '978-0521795401',
        edition: 'Cambridge University Press Edition',
        price: 380,
        originalPrice: 1100,
        condition: 'Good',
        category: 'Natural Sciences & Math',
        subject: 'Pure Mathematics & Topology',
        semester: 'Semester 5',
        coverImage: '/covers/cover_topology.jpg',
        images: ['/covers/cover_topology.jpg'],
        conditionNotes: 'Velvet dark cover, clean margin notes, fully legible tesseract diagrams.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'Mathematical Institute Commons',
        views: 285,
        wishlistCount: 22,
        featured: false
      },
      {
        title: 'Nonlinear Dynamics and Chaos: With Applications to Physics & Biology',
        author: 'Steven H. Strogatz',
        description: 'Master phase portraits, bifurcations, limit cycles, Lorenz attractors, and fractals through intuitive geometry and real-world scientific modeling.',
        isbn: '978-0813349107',
        edition: '2nd Classic Edition',
        price: 350,
        originalPrice: 950,
        condition: 'Like New',
        category: 'Engineering & Technology',
        subject: 'Applied Mathematics & Dynamical Systems',
        semester: 'Semester 3',
        coverImage: '/covers/cover_quantum.jpg',
        images: ['/covers/cover_quantum.jpg'],
        conditionNotes: 'Includes Strogatz problem sets and Python simulation notebook references.',
        status: 'available',
        owner: u1._id,
        campusLocation: 'Central Science Library',
        views: 210,
        wishlistCount: 17,
        featured: false
      },
      {
        title: 'Cellular Bioenergetics: Mitochondrial Mechanisms & Metabolic Flux',
        author: 'Prof. David G. Nicholls & Stuart J. Ferguson',
        description: 'Detailed analysis of chemiosmotic theory, ATP synthesis kinetics, electron transport chain complexes, and metabolic regulation in physiological disease states.',
        isbn: '978-0123884251',
        edition: '4th Edition Academic Press',
        price: 410,
        originalPrice: 1200,
        condition: 'Good',
        category: 'Medical & Healthcare',
        subject: 'Biochemistry & Cellular Physiology',
        semester: 'Year 2',
        coverImage: '/covers/cover_genomic.jpg',
        images: ['/covers/cover_genomic.jpg'],
        conditionNotes: 'Highlighted enzyme pathways in Chapter 4; crisp binding.',
        status: 'available',
        owner: u2._id,
        campusLocation: 'Medical Sciences Atrium',
        views: 190,
        wishlistCount: 14,
        featured: false
      },
      {
        title: 'Autonomous Micro-Grid Architectures & Computational Energy',
        author: 'Dr. Katherine Bell & Dr. Soren Lindqvist',
        description: 'Modern computational analysis of distributed energy storage, decentralized smart inverter control, and renewable grid synchronization.',
        isbn: '978-1119567302',
        edition: 'IEEE Press Engineering Series',
        price: 450,
        originalPrice: 1300,
        condition: 'Like New',
        category: 'Engineering & Technology',
        subject: 'Electrical Power Engineering',
        semester: 'Semester 6',
        coverImage: '/covers/cover_cybernetics.jpg',
        images: ['/covers/cover_cybernetics.jpg'],
        conditionNotes: 'Flawless hardcover with complete Simulink companion models.',
        status: 'available',
        owner: u4._id,
        campusLocation: 'Energy Systems Research Building',
        views: 175,
        wishlistCount: 12,
        featured: false
      },
      {
        title: 'Behavioral Game Theory: Experiments in Strategic Interaction',
        author: 'Colin F. Camerer',
        description: 'Empirical foundations of strategic behavior, bounded rationality, ultimatum bargaining, signaling games, and neuroeconomics. Classic foundation for MBA & economics research.',
        isbn: '978-0691090061',
        edition: 'Princeton University Press',
        price: 360,
        originalPrice: 1050,
        condition: 'Good',
        category: 'Commerce, Finance & MBA',
        subject: 'Behavioral Economics',
        semester: 'Semester 2',
        coverImage: '/covers/cover_finance.jpg',
        images: ['/covers/cover_finance.jpg'],
        conditionNotes: 'Clean copy, unmarked decision trees, light cover edge fading.',
        status: 'available',
        owner: u3._id,
        campusLocation: 'Economics Graduate Study Room',
        views: 245,
        wishlistCount: 20,
        featured: false
      }
    ];

    const books = await Book.create(booksData);
    console.log(`[Seeder] Created ${books.length} bespoke luxury academic listings`);

    // Add some books to Aanya and Sophia's wishlists
    u1.wishlist.push(books[2]._id, books[4]._id);
    u3.wishlist.push(books[0]._id, books[1]._id);
    await Promise.all([u1.save(), u3.save()]);

    // Create StudyVault Academic Documents
    const resourcesData = [
      {
        title: 'GATE CS & IT Previous 12-Year Chapter-wise Solved Question Bank',
        description: 'Complete topic-wise solved papers with step-by-step mathematical proofs across discrete math, algorithms, operating systems, databases, and computer networks.',
        category: 'Competitive Exams',
        fileType: 'Question Paper',
        subject: 'Computer Science & Engineering',
        semester: 'GATE / PSU Prep',
        fileUrl: '/notes/gate_cs_solved_papers.pdf',
        fileName: 'gate_cs_it_12yr_solved_papers.pdf',
        fileSize: '6.4 MB',
        tags: ['GATE', 'ComputerScience', 'SolvedPapers', 'Algorithms', 'DBMS'],
        downloadCount: 1820,
        upvotes: 230,
        uploader: u4._id
      },
      {
        title: 'Quantitative Aptitude & Speed Math Formulas for Placements & CAT',
        description: 'High-speed calculation shortcuts, modular arithmetic rules, Vedic math formulas, and chapter-wise trick sheets for campus placements and competitive entrance exams.',
        category: 'Competitive Exams',
        fileType: 'Cheat Sheet',
        subject: 'Quantitative Aptitude & Mental Math',
        semester: 'Placement Season',
        fileUrl: '/notes/quantitative_aptitude_speed_math.pdf',
        fileName: 'quant_speed_math_shortcuts.pdf',
        fileSize: '2.9 MB',
        tags: ['Aptitude', 'CAT', 'Placements', 'Shortcuts', 'SpeedMath'],
        downloadCount: 1610,
        upvotes: 198,
        uploader: u3._id
      },
      {
        title: 'DSA & LeetCode 150 Patterns Master Revision Sheet',
        description: 'Visual pattern recognition guide for sliding window, two-pointer, monotonic stack, fast-and-slow pointers, tree traversals, Dijkstra, and DP memoization templates.',
        category: 'Computer Science & AI',
        fileType: 'Cheat Sheet',
        subject: 'Data Structures & Algorithms',
        semester: 'Placements & Semester 4',
        fileUrl: '/notes/dsa_leetcode_150_cheatsheet.pdf',
        fileName: 'dsa_leetcode150_patterns_master_sheet.pdf',
        fileSize: '3.8 MB',
        tags: ['DSA', 'LeetCode150', 'Algorithms', 'InterviewPrep'],
        downloadCount: 1420,
        upvotes: 185,
        uploader: u1._id
      },
      {
        title: 'Operating Systems & DBMS Core Technical Interview Capsule',
        description: 'High-yield technical interview preparation notes. Covers thread vs process, deadlocks prevention, paging & segmentation, B-Tree vs B+ Tree indexes, ACID properties, normalization forms, and SQL transaction isolation.',
        category: 'Interview Preparation & Coding',
        fileType: 'Cheat Sheet',
        subject: 'Operating Systems & Database Systems',
        semester: 'Placements Season',
        fileUrl: '/notes/operating_systems_dbms_capsule.pdf',
        fileName: 'os_dbms_interview_capsule.pdf',
        fileSize: '3.4 MB',
        tags: ['OperatingSystems', 'DBMS', 'SQL', 'InterviewPrep', 'CoreCS'],
        downloadCount: 1340,
        upvotes: 172,
        uploader: u4._id
      },
      {
        title: 'System Design & High-Level Architecture (HLD) Interview Handbook',
        description: 'Comprehensive blueprint covering horizontal vs vertical scaling, load balancers, caching layers (Redis), DB sharding, CAP theorem, and concrete designs for TinyURL, Rate Limiter, and Notification System.',
        category: 'Software Development & Web',
        fileType: 'Notes',
        subject: 'Distributed Systems & System Design',
        semester: 'Placements & Semester 6',
        fileUrl: '/notes/system_design_hld_handbook.pdf',
        fileName: 'system_design_hld_interview_handbook.pdf',
        fileSize: '5.6 MB',
        tags: ['SystemDesign', 'DistributedSystems', 'Microservices', 'HLD'],
        downloadCount: 1280,
        upvotes: 164,
        uploader: u4._id
      },
      {
        title: 'Machine Learning & Deep Learning Mathematics Formula Capsule',
        description: 'Step-by-step mathematical summary of Gradient Descent variants (Adam, RMSProp), Backpropagation matrix calculus, Cross-Entropy loss, Attention mechanism derivations, and CNN kernel mechanics.',
        category: 'Machine Learning & AI',
        fileType: 'Cheat Sheet',
        subject: 'Mathematical Foundations of ML & DL',
        semester: 'Semester 5 & 6',
        fileUrl: '/notes/machine_learning_math_formulas.pdf',
        fileName: 'ml_dl_math_formula_capsule.pdf',
        fileSize: '4.2 MB',
        tags: ['MachineLearning', 'Backprop', 'LinearAlgebra', 'PyTorch'],
        downloadCount: 1150,
        upvotes: 142,
        uploader: u1._id
      },
      {
        title: 'Full-Stack Web Development Architecture & React 19 Reference',
        description: 'Production best practices for modern web apps. Covers React Server Components, custom hooks design, Next.js / Vite pipelines, REST & GraphQL API design, JWT auth security, and state management patterns.',
        category: 'Software Development & Web',
        fileType: 'Notes',
        subject: 'Full-Stack Web Engineering',
        semester: 'Semester 4 & 5',
        fileUrl: '/notes/fullstack_react19_architecture.pdf',
        fileName: 'fullstack_react19_architecture_guide.pdf',
        fileSize: '4.7 MB',
        tags: ['React', 'NodeJS', 'FullStack', 'WebDev', 'APIDesign'],
        downloadCount: 961,
        upvotes: 118,
        uploader: u1._id
      },
      {
        title: 'Transformer Attention Mechanisms & Vector Embeddings Deep Dive',
        description: 'Step-by-step breakdown of Multi-Head Self-Attention, FlashAttention algorithms, Rotary Position Embeddings (RoPE), and vector database similarity search with hands-on PyTorch implementations.',
        category: 'Machine Learning & AI',
        fileType: 'Notes',
        subject: 'Deep Learning & NLP',
        semester: 'Semester 5 & 6',
        fileUrl: '/notes/machine_learning_math_formulas.pdf',
        fileName: 'transformer_attention_mechanisms_guide.pdf',
        fileSize: '5.2 MB',
        tags: ['Transformers', 'PyTorch', 'Attention', 'LLMs'],
        downloadCount: 890,
        upvotes: 124,
        uploader: u1._id
      }
    ];

    const resources = await Resource.create(resourcesData);
    console.log(`[Seeder] Created ${resources.length} study vault resources`);

    // Create Sample Inquiries / Conversation Threads
    const inquiriesData = [
      {
        book: books[0]._id, // Quantum Dynamics
        buyer: u3._id, // Sophia
        seller: u1._id, // Aanya
        offeredPrice: 42,
        proposedLocation: 'Clarendon Physics Library Front Steps',
        status: 'accepted',
        messages: [
          {
            sender: u3._id,
            text: 'Greetings Aanya! Is your Quantum Dynamics monograph still available? Would $42 work for an in-person exchange at the Physics Library around 2:30 PM?'
          },
          {
            sender: u1._id,
            text: 'Hello Sophia! Absolutely, $42 is very fair. 2:30 PM at the Clarendon Library steps works splendidly for me.'
          },
          {
            sender: u3._id,
            text: 'Superb! I will see you there with cash. Looking forward to the handover!'
          }
        ]
      },
      {
        book: books[1]._id, // Artificial Intelligence: A Modern Approach
        buyer: u4._id, // Rohan
        seller: u1._id, // Aanya
        offeredPrice: 550,
        proposedLocation: 'Bharti School Central Foyer',
        status: 'pending',
        messages: [
          {
            sender: u4._id,
            text: 'Hi Aanya, I am interested in Artificial Intelligence: A Modern Approach for my coursework. Can we meet after 4 PM today?'
          },
          {
            sender: u1._id,
            text: 'Hi Rohan! Yes, the book is available. Let me know when you reach the Bharti School foyer.'
          }
        ]
      }
    ];

    const inquiries = await Inquiry.create(inquiriesData);
    console.log(`[Seeder] Created ${inquiries.length} peer-to-peer inquiry conversations`);

    // Create Sample Reviews
    const reviewsData = [
      {
        seller: u1._id,
        book: books[0]._id,
        reviewer: u3._id,
        rating: 5,
        comment: 'Exceptional scholar and seller. The monograph was in immaculate condition, exactly as described.'
      },
      {
        seller: u2._id,
        book: books[2]._id,
        reviewer: u4._id,
        rating: 5,
        comment: 'Dr. Marcus was punctual and helpful. The genomic medicine book is an essential reference!'
      }
    ];

    const reviews = await Review.create(reviewsData);
    console.log(`[Seeder] Created ${reviews.length} peer reviews`);

    console.log('\n======================================================');
    console.log('🏛️ LitHaven (Obsidian Atelier) Seeding Completed!');
    console.log('======================================================');
    console.log('Demo Accounts:');
    console.log('1. Aanya Sharma   -> aanya@lithaven.edu   | password123 (Quantum/Neural Systems)');
    console.log('2. Dr. Marcus     -> marcus@lithaven.edu  | password123 (Genomic Medicine)');
    console.log('3. Sophia Chen    -> sophia@lithaven.edu  | password123 (Quantitative Finance)');
    console.log('4. Rohan Deshmukh -> rohan@lithaven.edu   | password123 (Cybernetics & Robotics)');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seeder] Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
