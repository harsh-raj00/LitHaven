const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const notesDir = path.join(__dirname, '../../frontend/public/notes');
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

function createStyledDoc(title, subject, author, college) {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4'
  });

  // Header Banner
  doc.rect(0, 0, 595.28, 90).fill('#1a1918');
  doc.fillColor('#d4623f').fontSize(10).font('Helvetica-Bold').text('LITHAVEN CAMPUS STUDY VAULT  •  TOPPER-VERIFIED REVISION CAPSULE', 50, 25);
  doc.fillColor('#f5f2eb').fontSize(18).font('Helvetica-Bold').text(title, 50, 42, { width: 495 });

  // Metadata Subheader
  doc.rect(0, 90, 595.28, 30).fill('#242220');
  doc.fillColor('#a8a29e').fontSize(9).font('Helvetica').text(`Subject: ${subject}   |   Author: ${author} (${college})   |   100% Free Campus Access`, 50, 99);

  doc.y = 140;
  doc.fillColor('#1a1918');
  return doc;
}

function addSectionHeader(doc, title) {
  doc.moveDown(1);
  doc.rect(50, doc.y, 495, 22).fill('#f0ece1');
  doc.fillColor('#1a1918').fontSize(11).font('Helvetica-Bold').text(title, 58, doc.y + 5);
  doc.moveDown(1);
  doc.font('Helvetica').fontSize(9.5).fillColor('#2d2b29');
}

function addBullet(doc, boldPrefix, content) {
  doc.font('Helvetica-Bold').fillColor('#1a1918').text(`• ${boldPrefix}: `, { continued: true });
  doc.font('Helvetica').fillColor('#333333').text(content, { lineGap: 3 });
}

// 1. DSA & LeetCode 150 Patterns Master Revision Sheet
function generateDSANotes() {
  const filePath = path.join(notesDir, 'dsa_leetcode_150_cheatsheet.pdf');
  const doc = createStyledDoc(
    'DSA & LeetCode 150 Patterns Master Revision Sheet',
    'Data Structures & Algorithms',
    'Aanya Sharma',
    'IIT Delhi'
  );
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  addSectionHeader(doc, '1. CORE ARRAY & STRING PATTERNS');
  addBullet(doc, 'Two Pointers (Opposite Direction)', 'Used on sorted arrays for target pairs. Left starts at 0, right at N-1. When sum < target: left++; when sum > target: right--. Time: O(N), Space: O(1).');
  addBullet(doc, 'Sliding Window (Dynamic)', 'Maintains a window [L, R] satisfying a constraint (e.g. longest substring without repeating chars). Expand R until invalid; shrink L until valid again. Maximize or minimize window length.');
  addBullet(doc, 'Prefix Sum & Frequency Maps', 'Useful for subarray sum equals K. Maintain hashmap of cumulative sums: if (currentSum - K) is in map, increment answer count. Reduces O(N^2) to O(N).');

  addSectionHeader(doc, '2. LINKED LIST & FAST/SLOW POINTERS (FLOYD CYCLE)');
  addBullet(doc, 'Cycle Detection', 'Slow advances by 1 step, Fast advances by 2 steps. If slow == fast, a cycle exists. To find cycle start: reset slow to head, advance both by 1 step until they meet.');
  addBullet(doc, 'In-Place Reversal', 'Keep prev = null, curr = head. While curr: next = curr.next; curr.next = prev; prev = curr; curr = next. Return prev.');

  addSectionHeader(doc, '3. BINARY SEARCH VARIANTS');
  addBullet(doc, 'Upper / Lower Bound', 'Never use mid = (low + high)/2 to prevent integer overflow; use low + (high - low) / 2. Shrink search space to find boundary condition or first True.');
  addBullet(doc, 'Search in Rotated Sorted Array', 'Identify the strictly sorted half (either nums[low] <= nums[mid] or nums[mid] <= nums[high]) and check if target lies within that half.');

  doc.addPage();
  // Page 2 Header
  doc.rect(0, 0, 595.28, 40).fill('#1a1918');
  doc.fillColor('#f5f2eb').fontSize(11).font('Helvetica-Bold').text('DSA & LeetCode 150 Revision Sheet  •  Page 2', 50, 15);
  doc.y = 60;

  addSectionHeader(doc, '4. DYNAMIC PROGRAMMING FORMULA CHEAT SHEET');
  addBullet(doc, '0/1 Knapsack', 'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]). Space can be optimized to 1D array iterating weight backwards from W down to wt[i].');
  addBullet(doc, 'Longest Common Subsequence (LCS)', 'If s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]. Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Base case: dp[0][*] = dp[*][0] = 0.');
  addBullet(doc, 'Longest Increasing Subsequence (LIS)', 'O(N^2) using DP: dp[i] = 1 + max(dp[j]) for j < i and nums[j] < nums[i]. O(N log N) using Patience Sorting + Binary Search on active tails.');

  addSectionHeader(doc, '5. GRAPH ALGORITHMS & TIME COMPLEXITIES');
  addBullet(doc, 'Breadth-First Search (BFS)', 'Level-order traversal using Queue. Finds shortest unweighted path in O(V + E) time.');
  addBullet(doc, 'Dijkstra Algorithm', 'Single-source shortest path for non-negative weights using Min-Heap / PriorityQueue. Time Complexity: O((V + E) log V).');
  addBullet(doc, 'Topological Sort (Kahn Algorithm)', 'Compute in-degrees for all vertices. Push 0-in-degree nodes to queue. If processed count != V, cycle exists. Essential for Course Schedule dependency problems.');

  doc.end();
  console.log('[PDF Generated] dsa_leetcode_150_cheatsheet.pdf');
}

// 2. Machine Learning & Deep Learning Mathematics Formula Capsule
function generateMLNotes() {
  const filePath = path.join(notesDir, 'machine_learning_math_formulas.pdf');
  const doc = createStyledDoc(
    'Machine Learning & Deep Learning Mathematics Formula Capsule',
    'Machine Learning & Mathematical Foundations',
    'Dr. Marcus Vance',
    'AIIMS / Johns Hopkins'
  );
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  addSectionHeader(doc, '1. LOSS FUNCTIONS & DERIVATIVES');
  addBullet(doc, 'Mean Squared Error (MSE)', 'L(y, y_hat) = (1/N) * sum((y_i - y_hat_i)^2). Gradient with respect to weight: dL/dw = (-2/N) * sum(x_i * (y_i - y_hat_i)). Convex surface with unique global minimum.');
  addBullet(doc, 'Binary Cross-Entropy (Log Loss)', 'L(y, p) = - [ y * log(p) + (1 - y) * log(1 - p) ]. Used with Sigmoid activation. Derivative with respect to logit z = p - y.');
  addBullet(doc, 'Categorical Cross-Entropy', 'L(y, p) = - sum_k ( y_k * log(p_k) ). Paired with Softmax activation: p_i = exp(z_i) / sum(exp(z_j)). Derivative dL/dz_i = p_i - y_i.');

  addSectionHeader(doc, '2. OPTIMIZATION ALGORITHMS');
  addBullet(doc, 'Stochastic Gradient Descent (SGD) with Momentum', 'v_t = beta * v_{t-1} + (1 - beta) * grad_t;  theta_t = theta_{t-1} - alpha * v_t. Damps oscillations along high-curvature directions.');
  addBullet(doc, 'Adam Optimizer', 'Computes adaptive learning rates using first moment m_t (mean) and second raw moment v_t (uncentered variance). Bias correction: m_hat = m_t / (1 - beta1^t), v_hat = v_t / (1 - beta2^t). Update: theta = theta - (alpha / (sqrt(v_hat) + eps)) * m_hat.');

  addSectionHeader(doc, '3. TRANSFORMER ATTENTION MECHANISMS');
  addBullet(doc, 'Scaled Dot-Product Attention', 'Attention(Q, K, V) = Softmax( (Q * K^T) / sqrt(d_k) ) * V. The scaling factor 1/sqrt(d_k) prevents extremely small softmax gradients in high dimensional spaces.');
  addBullet(doc, 'Multi-Head Attention (MHA)', 'MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O, where head_i = Attention(Q * W_Q_i, K * W_K_i, V * W_V_i). Allows model to jointly attend to info at different positions.');

  doc.addPage();
  doc.rect(0, 0, 595.28, 40).fill('#1a1918');
  doc.fillColor('#f5f2eb').fontSize(11).font('Helvetica-Bold').text('Machine Learning Mathematics Capsule  •  Page 2', 50, 15);
  doc.y = 60;

  addSectionHeader(doc, '4. REGULARIZATION & GENERALIZATION');
  addBullet(doc, 'L1 Regularization (Lasso)', 'Adds lambda * sum(|w_i|). Drives non-essential weights to strictly zero, producing sparse models and automatic feature selection.');
  addBullet(doc, 'L2 Regularization (Ridge / Weight Decay)', 'Adds (1/2) * lambda * sum(w_i^2). Pulls weights towards zero without making them exactly zero. Prevents individual features from dominating decisions.');
  addBullet(doc, 'Batch Normalization (BN)', 'Normalizes mini-batch activations: x_hat = (x - mu_B) / sqrt(sigma_B^2 + eps). Scales and shifts: y = gamma * x_hat + beta. Accelerates convergence and stabilizes deep networks.');

  doc.end();
  console.log('[PDF Generated] machine_learning_math_formulas.pdf');
}

// 3. System Design & High-Level Architecture (HLD) Interview Handbook
function generateSystemDesignNotes() {
  const filePath = path.join(notesDir, 'system_design_hld_handbook.pdf');
  const doc = createStyledDoc(
    'System Design & High-Level Architecture (HLD) Interview Handbook',
    'System Design & Distributed Systems',
    'Aanya Sharma',
    'IIT Delhi / ACM Fellow'
  );
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  addSectionHeader(doc, '1. DISTRIBUTED SYSTEMS FIRST PRINCIPLES');
  addBullet(doc, 'CAP Theorem', 'In a network partition (P), a distributed system must trade off between Consistency (C) — every read receives the most recent write — and Availability (A) — every non-failing node returns a non-error response.');
  addBullet(doc, 'PACELC Theorem', 'If Partition (P), trade off Availability (A) and Consistency (C); Else (E), trade off Latency (L) and Consistency (C). Explains DynamoDB and Cassandra design tradeoffs.');

  addSectionHeader(doc, '2. SCALABILITY & CACHING STRATEGIES');
  addBullet(doc, 'Cache-Aside (Lazy Loading)', 'Application checks cache first. If cache miss: queries DB, writes to cache, returns result. Pros: resilient to cache failures. Cons: high miss latency, potential stale data.');
  addBullet(doc, 'Write-Through vs Write-Back', 'Write-Through writes to cache and DB simultaneously (higher write latency, zero data loss). Write-Back writes to cache immediately and flushes asynchronously to DB (ultra low latency, small risk of data loss on crash).');
  addBullet(doc, 'Consistent Hashing', 'Maps servers and keys to a 360-degree hash ring. Adding/removing a server only shifts K/N keys rather than remapping all keys. Virtual nodes ensure uniform traffic distribution.');

  addSectionHeader(doc, '3. DATABASE SCALING & PARTITIONING');
  addBullet(doc, 'Horizontal Sharding', 'Splitting tables across physical database instances by shard key (e.g. user_id). Avoids hot partitions by using hash-based sharding.');
  addBullet(doc, 'Read Replicas & Master-Slave Replication', 'Single master handles all write transactions; multiple read replicas serve read-heavy workloads (e.g. 95% reads, 5% writes). Mitigate replication lag with sticky sessions.');

  doc.end();
  console.log('[PDF Generated] system_design_hld_handbook.pdf');
}

// 4. GATE CS & IT 10-Year Subject-Wise Question Bank
function generateGATENotes() {
  const filePath = path.join(notesDir, 'gate_cs_solved_question_bank.pdf');
  const doc = createStyledDoc(
    'GATE CS & IT: 10-Year Subject-Wise Question Bank & Solutions',
    'Competitive Examination Revision',
    'Rohan Deshmukh',
    'BITS Pilani (GATE AIR 42)'
  );
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  addSectionHeader(doc, '1. THEORY OF COMPUTATION (TOC)');
  addBullet(doc, 'Chomsky Hierarchy', 'Regular (Type 3 / DFA/NFA) subset of Context-Free (Type 2 / Pushdown Automata) subset of Context-Sensitive (Type 1 / LBA) subset of Recursively Enumerable (Type 0 / Turing Machine).');
  addBullet(doc, 'Pumping Lemma for Regular Languages', 'If L is regular, there exists pumping length p such that any string s with |s| >= p can be split into s = xyz where |xy| <= p, |y| > 0, and xy^i z in L for all i >= 0. Common counterexample: a^n b^n.');

  addSectionHeader(doc, '2. OPERATING SYSTEMS & COMPUTER ARCHITECTURE');
  addBullet(doc, 'Virtual Memory Paging', 'Physical Address = Frame Number * Frame Size + Offset. Effective Memory Access Time (EMAT) = Hit_TLB * (TLB_access + RAM_access) + Miss_TLB * (TLB_access + 2 * RAM_access).');
  addBullet(doc, 'Pipeline Hazards', 'Speedup = (k * n) / (k + n - 1), where k = number of pipeline stages, n = number of instructions. Structural, Data (RAW, WAR, WAW), and Control hazards.');

  addSectionHeader(doc, '3. COMPUTER NETWORKS & TCP/IP');
  addBullet(doc, 'TCP Flow & Congestion Control', 'Slow start doubles congestion window (CWND) every RTT until SSThresh is reached. Additive Increase Multiplicative Decrease (AIMD) increments CWND by 1 MSS per RTT upon successful ACK.');
  addBullet(doc, 'Subnetting & CIDR', 'Given IP 192.168.1.0/26: Number of subnets = 4, Total addresses per subnet = 64 (2^(32-26)), Usable host addresses = 62 (excluding network ID and broadcast address).');

  doc.end();
  console.log('[PDF Generated] gate_cs_solved_question_bank.pdf');
}

// 5. Operating Systems & DBMS Technical Interview Capsule
function generateOSDBMSNotes() {
  const filePath = path.join(notesDir, 'operating_systems_dbms_capsule.pdf');
  const doc = createStyledDoc(
    'Operating Systems & DBMS Technical Interview Capsule',
    'Core Computer Science Foundations',
    'Aanya Sharma',
    'IIT Delhi'
  );
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  addSectionHeader(doc, '1. OPERATING SYSTEMS CORE INTERVIEW QUESTIONS');
  addBullet(doc, 'Process vs Thread', 'A process has its own private virtual memory space (code, data, heap). Threads share the memory space of their parent process but maintain their own program counter, registers, and call stack.');
  addBullet(doc, 'Deadlock 4 Coffman Conditions', '1. Mutual Exclusion; 2. Hold and Wait; 3. No Preemption; 4. Circular Wait. Breaking any single condition prevents deadlock. Banker\'s algorithm checks safe states.');
  addBullet(doc, 'Virtual Memory & Thrashing', 'When high page fault frequency causes CPU to spend more time swapping pages between disk and RAM than executing instructions. Solved by increasing RAM or reducing degree of multiprogramming.');

  addSectionHeader(doc, '2. DATABASE MANAGEMENT SYSTEMS (DBMS)');
  addBullet(doc, 'ACID Properties', 'Atomicity (all or nothing, WAL undo logs), Consistency (schema integrity rules), Isolation (locking / MVCC), Durability (WAL redo logs persisted to disk).');
  addBullet(doc, 'B+ Tree Indexing', 'All records stored in leaf nodes linked sequentially for range queries. Internal nodes only store keys for navigation. Balanced tree with guaranteed O(log N) lookup, insertion, and deletion.');
  addBullet(doc, 'SQL Normalization (1NF to BCNF)', '1NF: Atomic values. 2NF: 1NF + no partial dependency on composite key. 3NF: 2NF + no transitive dependency (non-prime -> non-prime). BCNF: For every functional dependency X -> Y, X must be a super key.');

  doc.end();
  console.log('[PDF Generated] operating_systems_dbms_capsule.pdf');
}

// 6. Quantitative Aptitude & Speed Math Formulas
function generateQuantNotes() {
  const filePath = path.join(notesDir, 'quantitative_aptitude_speed_math.pdf');
  const doc = createStyledDoc(
    'Quantitative Aptitude & Speed Math Formulas for Placements & CAT',
    'Quantitative Aptitude & Logic',
    'Sophia Chen',
    'SRCC / Columbia'
  );
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  addSectionHeader(doc, '1. SPEED MATH & PERCENTAGE MULTIPLIERS');
  addBullet(doc, 'Fraction to Percentage Equivalents', '1/6 = 16.67%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%, 1/12 = 8.33%, 1/13 = 7.69%, 1/14 = 7.14%. Essential for mental arithmetic.');
  addBullet(doc, 'Successive Percentage Formula', 'Total change = (A + B + (A * B)/100)%. Example: 20% increase followed by 10% decrease = (20 - 10 - 2) = +8% net gain.');

  addSectionHeader(doc, '2. TIME, SPEED & DISTANCE');
  addBullet(doc, 'Average Speed (Equal Distances)', 'Avg Speed = (2 * S1 * S2) / (S1 + S2). Harmonious mean of the two speeds.');
  addBullet(doc, 'Relative Speed', 'Same direction: S_rel = |S1 - S2|. Opposite direction: S_rel = S1 + S2. Used for train crossing problems and circular track chases.');

  addSectionHeader(doc, '3. PERMUTATIONS, COMBINATIONS & PROBABILITY');
  addBullet(doc, 'P&C Fundamental Rules', 'nPr = n! / (n - r)! (order matters, arrangements). nCr = n! / (r! * (n - r)!) (order does not matter, selections). Key identity: nCr = nC(n-r).');
  addBullet(doc, 'Bayes Theorem', 'P(A|B) = [ P(B|A) * P(A) ] / P(B). Calculates posterior probability of event A given prior observation B.');

  doc.end();
  console.log('[PDF Generated] quantitative_aptitude_speed_math.pdf');
}

// 7. Full-Stack Web Development Architecture & React 19 Reference
function generateFullstackNotes() {
  const filePath = path.join(notesDir, 'fullstack_react19_architecture.pdf');
  const doc = createStyledDoc(
    'Full-Stack Web Development Architecture & React 19 Reference',
    'Software Engineering & Web Architecture',
    'Aanya Sharma',
    'IIT Delhi / Full-Stack Architect'
  );
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  addSectionHeader(doc, '1. MODERN REACT 19 CONCEPTS');
  addBullet(doc, 'React Server Components (RSC)', 'Components executed solely on the server. Zero client bundle footprint for dependencies. Direct database and filesystem queries without intermediary API routes.');
  addBullet(doc, 'Server Actions & useActionState', 'Async functions invoked from client forms with automatic optimistic updates via useOptimistic() and pending state transitions via useTransition().');

  addSectionHeader(doc, '2. REST vs GRAPHQL vs gRPC API ARCHITECTURE');
  addBullet(doc, 'REST', 'Standard HTTP verbs (GET, POST, PUT, DELETE), resource-oriented URLs, standard status codes (200, 201, 400, 401, 404, 500), easy caching at CDN/browser level.');
  addBullet(doc, 'GraphQL', 'Single endpoint (/graphql). Client defines exact query schema. Eliminates over-fetching and under-fetching. Ideal for complex graphs and mobile clients.');
  addBullet(doc, 'gRPC & Protocol Buffers', 'Binary serialized RPC over HTTP/2 with bidirectional streaming. 7x-10x faster serialization than JSON. Standard for backend microservice communication.');

  doc.end();
  console.log('[PDF Generated] fullstack_react19_architecture.pdf');
}

// Run all generators
console.log('[Seeder] Generating genuine academic study note PDF documents...');
generateDSANotes();
generateMLNotes();
generateSystemDesignNotes();
generateGATENotes();
generateOSDBMSNotes();
generateQuantNotes();
generateFullstackNotes();
