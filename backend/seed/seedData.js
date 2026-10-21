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

    // Create 12 Bespoke Luxury Books with Original Generated Artwork
    const booksData = [
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
        views: 850,
        wishlistCount: 72,
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
        views: 840,
        wishlistCount: 70,
        featured: true
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
        featured: true
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
        views: 650,
        wishlistCount: 54,
        featured: true
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
        featured: true
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
        featured: true
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
        featured: true
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
        views: 575,
        wishlistCount: 49,
        featured: true
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
        title: 'Advanced Tensor Calculus & Differential Forms Master Reference',
        description: '38-page distilled formulation covering Christoffel symbols, Riemann curvature tensor derivations, and Hodge duals with worked physics problems.',
        category: 'Natural Sciences & Math',
        fileType: 'Cheat Sheet',
        subject: 'Differential Geometry & General Relativity',
        semester: 'Semester 4',
        fileUrl: '/covers/cover_quantum.jpg',
        fileName: 'tensor_calculus_master_reference.pdf',
        fileSize: '4.8 MB',
        tags: ['Tensors', 'DifferentialGeometry', 'Physics', 'CheatSheet'],
        downloadCount: 512,
        upvotes: 68,
        uploader: u1._id
      },
      {
        title: 'Transformer Attention Mechanisms & Vector Embeddings Deep Dive',
        description: 'Step-by-step mathematical breakdown of Multi-Head Self-Attention, FlashAttention algorithms, and Rotary Position Embeddings (RoPE) with PyTorch code.',
        category: 'Computer Science & AI',
        fileType: 'Notes',
        subject: 'Deep Learning & NLP',
        semester: 'Semester 5',
        fileUrl: '/covers/cover_neural.jpg',
        fileName: 'transformer_attention_mechanisms_guide.pdf',
        fileSize: '5.2 MB',
        tags: ['Transformers', 'PyTorch', 'Attention', 'LLMs', 'ResearchNotes'],
        downloadCount: 680,
        upvotes: 94,
        uploader: u1._id
      },
      {
        title: 'High-Yield CRISPR Gene-Editing Protocols & Off-Target Validation Guide',
        description: 'Comprehensive bench protocols for sgRNA design, Cas9 ribonucleoprotein electroporation, and deep sequencing off-target detection assays.',
        category: 'Medical & Healthcare',
        fileType: 'Cheat Sheet',
        subject: 'Molecular Biology & Genetics',
        semester: 'Year 2 & 3',
        fileUrl: '/covers/cover_genomic.jpg',
        fileName: 'crispr_molecular_protocols_handbook.pdf',
        fileSize: '3.9 MB',
        tags: ['CRISPR', 'Genomics', 'MolecularBiology', 'LabProtocols'],
        downloadCount: 430,
        upvotes: 56,
        uploader: u2._id
      },
      {
        title: 'Stochastic Calculus & Itô Lemma for Financial Derivatives Derivation',
        description: 'Clean derivations of geometric Brownian motion, Girsanov theorem, change of numeraire, and Black-Scholes risk-neutral pricing.',
        category: 'Commerce, Finance & MBA',
        fileType: 'Solution',
        subject: 'Quantitative Finance & Derivatives',
        semester: 'Semester 3',
        fileUrl: '/covers/cover_finance.jpg',
        fileName: 'stochastic_calculus_ito_lemma_derivations.pdf',
        fileSize: '3.4 MB',
        tags: ['Stochastics', 'ItoLemma', 'Derivatives', 'Finance'],
        downloadCount: 390,
        upvotes: 47,
        uploader: u3._id
      },
      {
        title: 'State-Space Control & Kalman Filter Implementation Slides',
        description: 'Lecture slides covering controllability and observability gramians, LQR optimal control, and extended Kalman filter state estimation.',
        category: 'Engineering & Technology',
        fileType: 'Presentation',
        subject: 'Modern Control Engineering',
        semester: 'Semester 6',
        fileUrl: '/covers/cover_cybernetics.jpg',
        fileName: 'kalman_filter_state_space_control.pdf',
        fileSize: '7.1 MB',
        tags: ['ControlSystems', 'KalmanFilter', 'Robotics', 'Slides'],
        downloadCount: 460,
        upvotes: 62,
        uploader: u4._id
      },
      {
        title: 'Homotopy & Fundamental Group University Exam Practice Problems',
        description: 'Complete verified solutions for university graduate topology examinations including Seifert-van Kampen theorem calculations and torus knot fundamental groups.',
        category: 'Natural Sciences & Math',
        fileType: 'Question Paper',
        subject: 'Algebraic Topology',
        semester: 'Semester 5',
        fileUrl: '/covers/cover_topology.jpg',
        fileName: 'algebraic_topology_exam_solutions.pdf',
        fileSize: '4.1 MB',
        tags: ['Topology', 'Homotopy', 'ExamPapers', 'Solutions'],
        downloadCount: 310,
        upvotes: 38,
        uploader: u4._id
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
