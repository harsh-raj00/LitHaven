import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and stamp total page count,
    running headers, and running footers on every page.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Top Running Header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#143322"))
        self.drawString(36, 808, "LITHAVEN CAMPUS STUDY VAULT")

        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#4A7057"))
        self.drawString(178, 808, "•   ACADEMIC ARCHIVE & PLACEMENT BLUEPRINT   •   CAMPUS CIRCULATION")

        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#C85732"))
        self.drawRightString(559, 808, "VERIFIED EDITION 2026")

        # Double hairline header rule
        self.setStrokeColor(colors.HexColor("#143322"))
        self.setLineWidth(1)
        self.line(36, 802, 559, 802)
        self.setStrokeColor(colors.HexColor("#C85732"))
        self.setLineWidth(0.6)
        self.line(36, 799, 559, 799)

        # Bottom Running Footer
        self.setStrokeColor(colors.HexColor("#D6CEBD"))
        self.setLineWidth(0.6)
        self.line(36, 36, 559, 36)

        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#627A6D"))
        self.drawString(36, 26, "LitHaven Academic Sanctuary  •  Peer-to-Peer Student Knowledge Network  •  Zero Commercial Royalty")

        page_str = f"Page {self._pageNumber} of {page_count}"
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#143322"))
        self.drawRightString(559, 26, page_str)
        self.restoreState()


def get_shared_styles():
    styles = getSampleStyleSheet()

    c_forest = colors.HexColor("#143322")
    c_terracotta = colors.HexColor("#C85732")
    c_sage = colors.HexColor("#4A7057")
    c_dark = colors.HexColor("#1C2826")
    c_parchment = colors.HexColor("#F3EFE6")
    c_border = colors.HexColor("#D6CEBD")

    return {
        'forest': c_forest,
        'terracotta': c_terracotta,
        'sage': c_sage,
        'dark': c_dark,
        'parchment': c_parchment,
        'border': c_border,
        'title': ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontName='Times-Bold',
            fontSize=19,
            leading=23,
            textColor=c_forest,
            spaceAfter=3
        ),
        'subtitle': ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.2,
            leading=12.5,
            textColor=c_sage,
            spaceAfter=9
        ),
        'heading': ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Times-Bold',
            fontSize=11.5,
            leading=14.5,
            textColor=c_forest,
            spaceBefore=11,
            spaceAfter=5
        ),
        'body': ParagraphStyle(
            'BodyDark',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8,
            leading=11.2,
            textColor=c_dark
        ),
        'code': ParagraphStyle(
            'CodeStyle',
            parent=styles['Code'],
            fontName='Courier',
            fontSize=7.2,
            leading=9.2,
            textColor=colors.HexColor("#ECEFF4")
        ),
        'th': ParagraphStyle(
            'TableHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=7.8,
            leading=9.8,
            textColor=colors.white
        ),
        'td': ParagraphStyle(
            'TableCell',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=7.3,
            leading=9.6,
            textColor=c_dark
        ),
        'td_bold': ParagraphStyle(
            'TableCellBold',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=7.3,
            leading=9.6,
            textColor=c_forest
        ),
        'td_code': ParagraphStyle(
            'TableCellCode',
            parent=styles['Normal'],
            fontName='Courier-Bold',
            fontSize=7.2,
            leading=9.6,
            textColor=c_terracotta
        )
    }


def make_header_banner(title, subtitle, meta_line, st):
    meta_p = Paragraph(f"<font color='#C85732'><b>LITHAVEN CAMPUS STUDY VAULT • OFFICIAL REVISION CAPSULE</b></font><br/>{meta_line}", st['body'])
    banner_data = [
        [Paragraph(title, st['title'])],
        [Paragraph(subtitle, st['subtitle'])],
        [meta_p]
    ]
    t = Table(banner_data, colWidths=[523])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), st['parchment']),
        ('BOX', (0, 0), (-1, -1), 1, st['forest']),
        ('LINEBEFORE', (0, 0), (0, -1), 4, st['terracotta']),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    return t


def make_checklist_box(items, st):
    chk_p = [Paragraph(f"• &nbsp; {item}", st['body']) for item in items]
    chk_table = Table([[p] for p in chk_p], colWidths=[523])
    chk_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FDF8EE")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#C97F26")),
        ('LINEBEFORE', (0, 0), (0, -1), 4, st['terracotta']),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    return chk_table


# ==============================================================================
# 1. DSA & LeetCode 150 Patterns Master Revision Guide
# ==============================================================================
def build_dsa_guide(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=48, bottomMargin=48)
    st = get_shared_styles()
    story = []

    banner = make_header_banner(
        "DSA & LeetCode 150 Patterns Master Revision Guide",
        "The definitive high-yield blueprint: 14 algorithmic patterns, time & space Big-O matrix, clean implementation templates, and essential interview mental models.",
        "<b>COURSE:</b> CS201 Data Structures & Algorithms &nbsp;|&nbsp; <b>TARGET:</b> Top Tier Product Engineering & Campus Placements &nbsp;|&nbsp; <b>CIRCULATION:</b> Free Open Academic",
        st
    )
    story.append(banner)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. The 14 Core Algorithmic Problem-Solving Patterns", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    patterns = [
        ("Two Pointers", "Sorted arrays/linked lists; searching pairs or palindromes without extra space.", "Array / LinkedList", "O(N) time, O(1) space", "Two Sum II, 3Sum, Container Most Water"),
        ("Sliding Window", "Contiguous subarrays/substrings satisfying min/max/length condition.", "Array, String, Hash Map", "O(N) time, O(K) space", "Longest Substring w/o Repeat, Min Window Substring"),
        ("Fast & Slow Pointers", "Cycle detection in sequences or linked lists; finding middle node.", "LinkedList, Array", "O(N) time, O(1) space", "LinkedList Cycle, Find Duplicate Number"),
        ("Merge Intervals", "Overlapping intervals, scheduling, calendar collisions, disjoint ranges.", "Array of Intervals", "O(N log N) time, O(1) space", "Merge Intervals, Insert Interval, Non-overlapping"),
        ("Cyclic Sort", "Arrays with numbers in fixed range 1..N or 0..N finding missing/duplicated elements.", "Array (In-Place)", "O(N) time, O(1) space", "Missing Number, Find All Duplicates, First Missing Positive"),
        ("In-place Reversal", "Reversing sublists in singly linked lists without allocating new nodes.", "LinkedList", "O(N) time, O(1) space", "Reverse Linked List, Reverse Nodes in k-Group"),
        ("Tree BFS (Level Order)", "Level-by-level traversal, shortest path in unweighted tree, tree zigzag.", "Queue (FIFO)", "O(N) time, O(W) space", "Binary Tree Level Order, Right Side View"),
        ("Tree DFS (Pre/In/Post)", "Root-to-leaf paths, maximum depth, tree isomorphism, subtree checking.", "Call Stack / Explicit Stack", "O(N) time, O(H) space", "Max Path Sum, Lowest Common Ancestor, Validate BST"),
        ("Two Heaps", "Calculating rolling median or streaming percentiles on incoming stream.", "Min-Heap & Max-Heap", "O(log N) insert, O(1) median", "Find Median from Data Stream, IPO"),
        ("Subsets & Backtracking", "Combinations, permutations, powersets, decision trees with constraint pruning.", "Recursion / State Array", "O(2^N) or O(N!) time", "Subsets, Permutations, Combination Sum, Word Search"),
        ("Modified Binary Search", "Searching sorted or rotated sorted arrays with logarithmic guarantees.", "Array (Sorted)", "O(log N) time, O(1) space", "Search in Rotated Sorted Array, Find Peak Element"),
        ("Top 'K' Elements", "Finding K largest/smallest elements in unsorted collection without full sort.", "Min-Heap or QuickSelect", "O(N log K) time, O(K) space", "Kth Largest Element, Top K Frequent Elements"),
        ("K-way Merge", "Merging K sorted lists or sorted arrays into single sorted sequence.", "Min-Heap of size K", "O(N log K) time, O(K) space", "Merge k Sorted Lists, Kth Smallest in Sorted Matrix"),
        ("0/1 Knapsack & DP", "Optimal subset choices under budget, overlapping subproblems, memoization.", "DP Table / State Array", "O(N * W) time, O(W) space", "Coin Change, Partition Equal Subset, Target Sum")
    ]

    p_data = [[Paragraph("Pattern", st['th']), Paragraph("When to Use (Problem Clue)", st['th']), Paragraph("Structure", st['th']), Paragraph("Complexity", st['th']), Paragraph("LeetCode Benchmarks", st['th'])]]
    for name, trig, ds, comp, probs in patterns:
        p_data.append([Paragraph(name, st['td_bold']), Paragraph(trig, st['td']), Paragraph(ds, st['td']), Paragraph(comp, st['td_code']), Paragraph(probs, st['td'])])

    pt = Table(p_data, colWidths=[78, 150, 75, 88, 132])
    pt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(pt)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Algorithmic Big-O Complexity Master Matrix", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    ds_matrix = [
        ("Data Structure", "Access (Avg)", "Search (Avg)", "Insertion", "Deletion", "Worst Space"),
        ("Array (Dynamic)", "O(1)", "O(N)", "O(1) amortized", "O(N)", "O(N)"),
        ("Singly Linked List", "O(N)", "O(N)", "O(1) at head", "O(1) given node", "O(N)"),
        ("Hash Table / Map", "N/A", "O(1) avg / O(N) worst", "O(1) avg", "O(1) avg", "O(N)"),
        ("Binary Search Tree", "O(log N)", "O(log N)", "O(log N)", "O(log N)", "O(N) unbal."),
        ("Red-Black / AVL Tree", "O(log N)", "O(log N)", "O(log N)", "O(log N)", "O(N) strict"),
        ("Min / Max Binary Heap", "O(1) peek", "O(N)", "O(log N)", "O(log N) pop", "O(N)"),
        ("Trie (Prefix Tree)", "O(L) word len", "O(L) word len", "O(L) word len", "O(L)", "O(Alphabet * L * N)")
    ]
    ds_data = []
    for r_idx, row in enumerate(ds_matrix):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td_code']))
        ds_data.append(p_row)

    dst = Table(ds_data, colWidths=[110, 80, 85, 85, 85, 78])
    dst.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(dst)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. Pro-Interview Mental Models & Pitfall Checklist", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    chk = make_checklist_box([
        "<b>Off-by-One Guardrail:</b> When calculating midpoint, always use <code>mid = left + (right - left) // 2</code> to prevent 32-bit integer overflow.",
        "<b>Dummy Head Pattern:</b> In LinkedList node deletion or splicing, always instantiate <code>dummy = ListNode(0, head)</code> to eliminate special case branches for the head node.",
        "<b>Subarray vs Subsequence:</b> Subarrays are strictly contiguous (Sliding Window / Prefix Sum). Subsequences allow omissions while preserving index order (DP / Greedy).",
        "<b>Space Compression:</b> When DP transition only depends on <code>dp[i-1]</code> and <code>dp[i-2]</code>, compress the table to 2 scalar variables for O(1) auxiliary space.",
        "<b>BFS Queue Enqueue Mark:</b> Always mark graph nodes as visited immediately upon enqueueing, never on dequeueing, to prevent exponential queue ballooning in dense cyclic graphs."
    ], st)
    story.append(chk)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {output_path}")


# ==============================================================================
# 2. System Design & High-Level Architecture (HLD) Handbook
# ==============================================================================
def build_system_design_guide(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=48, bottomMargin=48)
    st = get_shared_styles()
    story = []

    banner = make_header_banner(
        "System Design & High-Level Architecture (HLD) Handbook",
        "Comprehensive blueprint covering horizontal scaling, load balancers, caching, database sharding, CAP theorem, and concrete production blueprints for TinyURL, Rate Limiters, and Notification Pipelines.",
        "<b>COURSE:</b> Distributed Systems & System Design &nbsp;|&nbsp; <b>TARGET:</b> SDE-2 / Senior Engineering & Architecture Interviews",
        st
    )
    story.append(banner)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Core Distributed Systems Tradeoffs & Guarantees", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    tradeoffs = [
        ("Theorem / Concept", "Core Principle", "Practical Industry Trade-off", "Real-World Examples"),
        ("CAP Theorem", "In network partition, choose Consistency (CP) or Availability (AP).", "CP sacrifices latency/uptime; AP allows stale reads across nodes.", "CP: HBase, Spanner, Zookeeper; AP: DynamoDB, Cassandra"),
        ("PACELC Theorem", "If Partition (P): A vs C. Else (E): Latency (L) vs Consistency (C).", "Evaluates database latency trade-offs during normal fault-free operation.", "MongoDB: PC/EC; Cassandra: PA/EL"),
        ("Consistent Hashing", "Distributes keys across hash ring using virtual nodes to prevent skew.", "Adding/removing nodes only re-keys K/N entries instead of all K.", "DynamoDB, Memcached, Akamai CDN Edge"),
        ("Caching Strategies", "Write-Through, Write-Back (Write-Behind), and Cache-Aside (Lazy).", "Write-Back has highest throughput but risks data loss on node failure.", "Redis, Memcached, CDN Varnish caching")
    ]
    t_data = []
    for r_idx, row in enumerate(tradeoffs):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        t_data.append(p_row)

    table1 = Table(t_data, colWidths=[90, 160, 140, 133])
    table1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table1)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Benchmark System Design Blueprints", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    designs = [
        ("Design Target", "Traffic Profile", "Core Architecture & Data Stores", "Key Bottleneck & Solution"),
        ("URL Shortener (TinyURL)", "Read-heavy (100:1 read:write). 500M URLs/mo.", "Base62 encoding (62^7 = 3.5T URLs), Key Generation Service (KGS), Redis Cache, NoSQL/PostgreSQL.", "Hash collisions: Use pre-generated non-colliding KGS IDs stored in DB tokens."),
        ("Distributed Rate Limiter", "Low-latency (<2ms), millisecond accuracy across cluster.", "Redis Cluster with Lua Scripting using Sliding Window Log or Token Bucket algorithm.", "Race conditions: Execute atomic Redis Lua script (evalsha) to update counts and timestamps."),
        ("Notification Pipeline", "High volume (billions/day), bursty, multiple channels.", "RabbitMQ / Kafka topics partitioned by user ID, priority worker pools, APNS / FCM / Twilio third-parties.", "Downstream vendor rate limits: Implement exponential backoff dead-letter queues (DLQ)."),
        ("Key-Value Store (Dynamo)", "High write throughput, high availability across regions.", "Consistent hashing ring, vector clocks for conflict resolution, sloppy quorum (W+R > N).", "Network split-brain: Gossip protocol for node membership and Merkle trees for anti-entropy.")
    ]
    d_data = []
    for r_idx, row in enumerate(designs):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        d_data.append(p_row)

    table2 = Table(d_data, colWidths=[105, 95, 175, 148])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table2)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. Back-of-the-Envelope Mental Constants & Estimation Rules", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    chk = make_checklist_box([
        "<b>Power of Two Rules:</b> 2^10 = 1 Thousand (1 KB) &nbsp;|&nbsp; 2^20 = 1 Million (1 MB) &nbsp;|&nbsp; 2^30 = 1 Billion (1 GB) &nbsp;|&nbsp; 2^40 = 1 Trillion (1 TB).",
        "<b>Daily Traffic Conversion:</b> 1 Million requests/day = 12 QPS average, ~25-30 QPS peak. 100 Million req/day = ~1,200 QPS avg, ~3,000 QPS peak.",
        "<b>Latency Numbers Every Engineer Must Know:</b> L1 cache: 0.5ns &nbsp;|&nbsp; Mutex lock/unlock: 25ns &nbsp;|&nbsp; Main RAM read: 100ns &nbsp;|&nbsp; SSD random read: 150us &nbsp;|&nbsp; Cross-datacenter RTT (US to EU): 150ms.",
        "<b>80/20 Caching Rule:</b> Cache 20% of the most active read data in RAM. For 500GB daily working set, size Redis cache at 100GB to serve 80%+ hits directly.",
        "<b>Database Storage Sizing:</b> Always multiply raw row payload by 1.4x to account for B-tree index overhead, write-ahead logs (WAL), and storage fragmentation."
    ], st)
    story.append(chk)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {output_path}")


# ==============================================================================
# 3. Machine Learning & Deep Learning Mathematics Formula Capsule
# ==============================================================================
def build_ml_guide(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=48, bottomMargin=48)
    st = get_shared_styles()
    story = []

    banner = make_header_banner(
        "Machine Learning & Deep Learning Mathematics Formula Capsule",
        "Step-by-step mathematical summary of Gradient Descent variants, Backpropagation matrix calculus, Attention mechanisms, Normalization layers, and Loss functions.",
        "<b>COURSE:</b> CS401 Machine Learning & Neural Networks &nbsp;|&nbsp; <b>TARGET:</b> AI/ML Research, Data Science Interviews & GATE AI",
        st
    )
    story.append(banner)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Loss Functions & Optimization Algorithms", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    losses = [
        ("Loss / Optimizer", "Mathematical Formulation", "Gradient / Update Equation", "Primary Application"),
        ("Mean Squared Error (MSE)", "L = (1/N) * sum((y_i - y_hat_i)^2)", "dL/dy_hat = -(2/N) * (y - y_hat)", "Linear Regression, Continuous Target"),
        ("Binary Cross-Entropy", "L = -(1/N) * sum(y*log(p) + (1-y)*log(1-p))", "dL/dz = p - y  (when paired with sigmoid)", "Binary Classification, Logistic Reg"),
        ("Categorical Cross-Entropy", "L = -sum(y_k * log(p_k))", "dL/dz_i = p_i - y_i  (with softmax)", "Multi-class Classification, Transformers"),
        ("Adam Optimizer", "m_t = beta1*m_{t-1} + (1-beta1)*g_t\nv_t = beta2*v_{t-1} + (1-beta2)*g_t^2", "theta_t = theta_{t-1} - lr * (m_hat / (sqrt(v_hat) + eps))", "Default adaptive optimizer for DL models"),
        ("RMSprop", "E[g^2]_t = gamma*E[g^2]_{t-1} + (1-gamma)*g_t^2", "theta = theta - (lr / sqrt(E[g^2]_t + eps)) * g_t", "Recurrent Neural Networks (RNN/LSTM)")
    ]
    l_data = []
    for r_idx, row in enumerate(losses):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        l_data.append(p_row)

    table1 = Table(l_data, colWidths=[110, 155, 145, 113])
    table1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table1)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Deep Learning Mathematics: Attention & CNN Mechanics", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    dl_formulas = [
        ("Architecture Component", "Mathematical Definition", "Dimension Transformation", "Intuition & Purpose"),
        ("Scaled Dot-Product Attention", "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V", "Q,K in R^{N x d_k}, V in R^{N x d_v}\nOutput in R^{N x d_v}", "Dividing by sqrt(d_k) prevents softmax gradient vanishing at large dimensions."),
        ("Multi-Head Attention", "MHA = Concat(head_1, ..., head_h) * W^O\nwhere head_i = Attention(Q*W_i^Q, K*W_i^K, V*W_i^V)", "Projected into h subspaces of size d_model / h", "Allows model to jointly attend to information from different representation subspaces."),
        ("CNN Output Dimension", "O = floor((W - K + 2P) / S) + 1", "W: input, K: kernel, P: padding, S: stride", "Determines spatial downsampling across conv and max-pooling layers."),
        ("Layer Normalization", "y = ((x - mu) / sqrt(sigma^2 + eps)) * gamma + beta", "Normalized across feature dimension d for each token", "Independent of batch size; critical for sequence models and Transformers.")
    ]
    dl_data = []
    for r_idx, row in enumerate(dl_formulas):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        dl_data.append(p_row)

    table2 = Table(dl_data, colWidths=[120, 160, 125, 118])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table2)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. Evaluation Metrics & Regularization Diagnostic Matrix", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    chk = make_checklist_box([
        "<b>Precision & Recall:</b> Precision = TP / (TP + FP) (Low false positives). Recall = TP / (TP + FN) (Low false negatives / high sensitivity).",
        "<b>F1-Score Harmonic Mean:</b> F1 = 2 * (Precision * Recall) / (Precision + Recall). Use F1 when classes are heavily imbalanced (e.g. fraud detection).",
        "<b>L1 vs L2 Regularization:</b> L1 (Lasso) penalty adds lambda * sum(|w|) causing sparse weights (feature selection). L2 (Ridge) penalty adds lambda * sum(w^2) shrinking weights smoothly.",
        "<b>Bias-Variance Tradeoff:</b> High Bias = Underfitting (add polynomial features, deeper model). High Variance = Overfitting (add Dropout, L2 decay, data augmentation).",
        "<b>Vanishing / Exploding Gradients:</b> Use He initialization for ReLU (std = sqrt(2/n_in)), Xavier/Glorot for Tanh (std = sqrt(2/(n_in + n_out))), and Gradient Clipping at norm threshold."
    ], st)
    story.append(chk)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {output_path}")


# ==============================================================================
# 4. Operating Systems & DBMS Core Technical Interview Capsule
# ==============================================================================
def build_os_dbms_guide(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=48, bottomMargin=48)
    st = get_shared_styles()
    story = []

    banner = make_header_banner(
        "Operating Systems & DBMS Core Technical Interview Capsule",
        "High-yield core computer science revision: Thread vs Process, Deadlocks prevention, Paging, Virtual Memory, B+ Tree indexes, ACID properties, and SQL Transaction Isolation levels.",
        "<b>COURSE:</b> Core CS Interview Series &nbsp;|&nbsp; <b>TARGET:</b> Campus Placement Interviews & GATE Computer Science",
        st
    )
    story.append(banner)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Operating Systems: Synchronization, Memory & Deadlocks", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    os_rows = [
        ("Concept Area", "Key Mechanism & Definition", "Underlying Hardware / Kernel Implementation", "Interview Question & Answer"),
        ("Process vs Thread", "Process has independent address space (PCB). Threads share text/heap/data segments with own stack and registers.", "Context switch between processes flushes TLB; thread context switch preserves TLB.", "Q: Why are threads lighter? A: Less state to save; no address space remapping."),
        ("Deadlock Conditions", "4 Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.", "Break Circular Wait by ordering resource acquisition globally (e.g. strict hierarchy).", "Q: What is Banker's algorithm? A: Safe state simulation before granting resource requests."),
        ("Paging & TLB", "Logical address divided into Page Number and Offset. MMU translates page to physical frame.", "TLB (Translation Lookaside Buffer) caches recent translations. TLB miss incurs page table walk.", "Q: What is thrashing? A: High page-fault frequency where CPU spends more time swapping than computing."),
        ("Mutex vs Semaphore", "Mutex is binary ownership lock. Semaphore is signaling integer counter (counting/binary).", "Wait (P / down) decrements; Signal (V / up) increments counter.", "Q: Can thread B unlock mutex owned by A? A: No, mutex requires ownership; semaphore does not.")
    ]
    os_data = []
    for r_idx, row in enumerate(os_rows):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        os_data.append(p_row)

    table1 = Table(os_data, colWidths=[90, 150, 140, 143])
    table1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table1)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. DBMS: Indexing, ACID & SQL Transaction Isolation", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    db_rows = [
        ("Isolation Level", "Dirty Read Prevention", "Non-Repeatable Read", "Phantom Read Prevention", "Locking / MVCC Mechanism"),
        ("Read Uncommitted", "NO (Allows dirty reads)", "NO", "NO", "Read without shared lock; highest concurrency, lowest consistency."),
        ("Read Committed", "YES (Guaranteed)", "NO", "NO", "Shared lock released immediately after statement executes (Postgres default)."),
        ("Repeatable Read", "YES", "YES (Guaranteed)", "NO (In pure 2PL, yes in InnoDB MVCC)", "Shared locks held until transaction completes; MVCC snapshot read."),
        ("Serializable", "YES", "YES", "YES (Complete isolation)", "Range locks / Predicate locks / Strict 2-Phase Locking (2PL). Lowest concurrency.")
    ]
    db_data = []
    for r_idx, row in enumerate(db_rows):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        db_data.append(p_row)

    table2 = Table(db_data, colWidths=[105, 95, 95, 105, 123])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table2)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. High-Yield B-Tree vs B+ Tree & Normalization Formulas", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    chk = make_checklist_box([
        "<b>B+ Tree Advantage over B-Tree:</b> Leaf nodes are linked in a doubly linked list, enabling fast range scans O(log N + K). Internal nodes only store keys (no records), maximizing branching factor (fan-out).",
        "<b>1NF to BCNF Rules:</b> 1NF (Atomic attributes) &nbsp;|&nbsp; 2NF (1NF + No partial dependency on candidate key) &nbsp;|&nbsp; 3NF (2NF + No transitive dependency) &nbsp;|&nbsp; BCNF (Every determinant X in X-&gt;Y must be a superkey).",
        "<b>WAL (Write-Ahead Logging):</b> Changes must be appended to disk log before the dirty buffer page is flushed to the table datafile (ARIES recovery protocol).",
        "<b>Clustered vs Non-Clustered Index:</b> Clustered index physically sorts table rows on disk (only 1 per table, typically Primary Key). Non-clustered index stores leaf pointers back to clustered row ID."
    ], st)
    story.append(chk)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {output_path}")


# ==============================================================================
# 5 & 6. GATE CS & IT Solved Question Bank
# ==============================================================================
def build_gate_cs_guide(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=48, bottomMargin=48)
    st = get_shared_styles()
    story = []

    banner = make_header_banner(
        "GATE CS & IT Previous 12-Year Chapter-wise Solved Question Bank",
        "High-weightage concept capsules and rigorous step-by-step solutions covering Data Structures, Operating Systems, DBMS, Theory of Computation, and Computer Networks.",
        "<b>EXAMINATION:</b> GATE Computer Science & Information Technology &nbsp;|&nbsp; <b>WEIGHTAGE:</b> 100 Marks Benchmark Syllabus",
        st
    )
    story.append(banner)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Subject Weightage & Core High-Yield Scoring Areas", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    gate_stats = [
        ("Discipline / Subject", "Average Marks", "Highest Frequency Core Topics", "Recommended Strategy"),
        ("Data Structures & Algorithms", "14 - 16 Marks", "Asymptotic Analysis, Trees, Heaps, Graph traversals, DP.", "Solve all Master Theorem and recursion tree problems."),
        ("Operating Systems", "8 - 10 Marks", "CPU Scheduling, Semaphores/Peterson's, Paging address translation.", "Master virtual memory page size & inverted table calculations."),
        ("DBMS", "7 - 9 Marks", "Relational Algebra, SQL subqueries, Normalization, Serializable schedules.", "Practice conflict serializability precedence graphs."),
        ("Theory of Computation (TOC)", "8 - 10 Marks", "DFA state minimization, Closure properties, Decidability, CFG.", "Memorize Chomsky hierarchy closure property matrix."),
        ("Computer Networks", "7 - 9 Marks", "Subnetting / CIDR, TCP Congestion Control, Sliding Window Flow Control.", "Learn Go-Back-N and Selective Repeat efficiency formulas.")
    ]
    g_data = []
    for r_idx, row in enumerate(gate_stats):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        g_data.append(p_row)

    table1 = Table(g_data, colWidths=[120, 80, 185, 138])
    table1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table1)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Selected Benchmark Solved GATE Problems", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    solved_questions = [
        ("Problem 1: Master Theorem Recurrence (GATE CS)",
         "<b>Question:</b> Solve T(n) = 3T(n/2) + Theta(n^2). Find the tight asymptotic bound.<br/>"
         "<b>Solution:</b> Here a = 3, b = 2, f(n) = n^2. Compute log_b(a) = log_2(3) approx 1.585.<br/>"
         "Since f(n) = Omega(n^{1.585 + eps}) for eps = 0.415, and 3(n/2)^2 = (3/4)n^2 &lt;= c*n^2 (regularity holds), by Master Theorem Case 3: <b>T(n) = Theta(n^2)</b>."),

        ("Problem 2: Two-Level Paging Address Translation (GATE CS)",
         "<b>Question:</b> 32-bit virtual address, 4 KB page size, 4 bytes per page table entry. Find size of second-level page table.<br/>"
         "<b>Solution:</b> Page offset = log_2(4 KB) = 12 bits. Virtual page number = 32 - 12 = 20 bits.<br/>"
         "Entries per page = 4 KB / 4 B = 1024 = 2^10 entries (10 bits for page table).<br/>"
         "Level 1 page index = 10 bits, Level 2 page index = 10 bits. Second-level page table size = 2^10 * 4 B = <b>4 KB</b>."),

        ("Problem 3: Sliding Window Protocol Maximum Efficiency (GATE CS)",
         "<b>Question:</b> Packet size = 1 KB, Bandwidth = 1.5 Mbps, Round Trip Time (RTT) = 45 ms. Find minimum window size W for 100% link utilization.<br/>"
         "<b>Solution:</b> Transmission time T_t = (1024 * 8 bits) / (1.5 * 10^6 bps) = 5.46 ms. Propagation delay T_p = RTT / 2 = 22.5 ms.<br/>"
         "Parameter a = T_p / T_t = 22.5 / 5.46 = 4.12. Minimum window size W = 1 + 2a = 1 + 2(4.12) = 9.24. Round up to <b>10 frames</b>.")
    ]

    for p_title, p_content in solved_questions:
        q_table = Table([
            [Paragraph(f"<b>{p_title}</b>", ParagraphStyle('QTitle', parent=st['body'], fontName='Helvetica-Bold', textColor=st['forest']))],
            [Paragraph(p_content, st['body'])]
        ], colWidths=[523])
        q_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), st['parchment']),
            ('BACKGROUND', (0, 1), (-1, 1), colors.white),
            ('BOX', (0, 0), (-1, -1), 0.6, st['border']),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(q_table)
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {output_path}")


# ==============================================================================
# 7. Quantitative Aptitude & Speed Math Formulas
# ==============================================================================
def build_quant_guide(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=48, bottomMargin=48)
    st = get_shared_styles()
    story = []

    banner = make_header_banner(
        "Quantitative Aptitude & Speed Math Formulas for Placements & CAT",
        "High-yield mental calculation shortcuts, fractional percentage equivalences, profit & loss, time and work equations, and permutations/probability formulas.",
        "<b>DISCIPLINE:</b> Aptitude & Mental Arithmetic &nbsp;|&nbsp; <b>TARGET:</b> Campus Placements, CAT, GATE General Aptitude & Banking",
        st
    )
    story.append(banner)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Percentage & Fractional Decimal Equivalences Table", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    frac_data = [
        ("Fraction", "Percentage", "Fraction", "Percentage", "Fraction", "Percentage", "Fraction", "Percentage"),
        ("1/2", "50.00%", "1/6", "16.67%", "1/10", "10.00%", "1/14", "7.14%"),
        ("1/3", "33.33%", "1/7", "14.28%", "1/11", "9.09%", "1/15", "6.67%"),
        ("1/4", "25.00%", "1/8", "12.50%", "1/12", "8.33%", "1/16", "6.25%"),
        ("1/5", "20.00%", "1/9", "11.11%", "1/13", "7.69%", "1/20", "5.00%")
    ]
    ft_data = []
    for r_idx, row in enumerate(frac_data):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx % 2 == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td_code']))
        ft_data.append(p_row)

    table1 = Table(ft_data, colWidths=[65, 65, 65, 65, 65, 65, 65, 68])
    table1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table1)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. High-Yield Commercial Math & Work Formulas", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    math_rows = [
        ("Topic Area", "Core Shortcut Formula", "Practical Calculation Example"),
        ("Successive Percentages", "Net % Change = a + b + (ab / 100)", "+20% and +30% -&gt; 20 + 30 + (600/100) = +56% net increase."),
        ("Profit & Loss / Dishonest Dealer", "Gain % = [Error / (True Value - Error)] * 100", "Dealer uses 900g instead of 1kg: [100 / (1000 - 100)] * 100 = 11.11% gain."),
        ("Time & Work Combined", "Together Time = (A * B) / (A + B)", "A does in 10 days, B in 15 days: (10 * 15) / (10 + 15) = 150 / 25 = 6 days."),
        ("Pipes & Cisterns", "Net Rate = 1/Inlet_1 + 1/Inlet_2 - 1/Leak", "Inlet fills in 6 hrs, leak empties in 8 hrs: 1/6 - 1/8 = 1/24 (fills in 24 hrs)."),
        ("Relative Speed", "Same Dir: |S1 - S2| &nbsp;|&nbsp; Opp Dir: S1 + S2", "Trains of lengths L1, L2 crossing: Time = (L1 + L2) / Relative Speed."),
        ("Boats & Streams", "Upstream U = B - S &nbsp;|&nbsp; Downstream D = B + S", "Boat speed B = (D + U) / 2 &nbsp;|&nbsp; Stream speed S = (D - U) / 2.")
    ]
    m_data = []
    for r_idx, row in enumerate(math_rows):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        m_data.append(p_row)

    table2 = Table(m_data, colWidths=[120, 185, 218])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table2)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. Speed Arithmetic & Combinatorics Mental Checklist", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    chk = make_checklist_box([
        "<b>Squaring numbers ending in 5:</b> Take prefix n, multiply by n+1, append 25. Example: 85^2 = 8*(9)|25 = 7225.",
        "<b>Base 100 Multiplication:</b> 96 * 97. Deviations are -4 and -3. Left part: 96 - 3 = 93. Right part: (-4)*(-3) = 12 -&gt; 9312.",
        "<b>Permutations vs Combinations:</b> Use nPr when order matters (seating, ranks). Use nCr when order is irrelevant (committees, card hands).",
        "<b>Circular Permutations:</b> Number of ways to arrange n distinct objects around a circle = (n - 1)!. For necklaces/garlands = (n - 1)! / 2."
    ], st)
    story.append(chk)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {output_path}")


# ==============================================================================
# 8. Full-Stack Web Development Architecture & React 19 Reference
# ==============================================================================
def build_fullstack_guide(output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=48, bottomMargin=48)
    st = get_shared_styles()
    story = []

    banner = make_header_banner(
        "Full-Stack Web Development Architecture & React 19 Reference",
        "Production engineering blueprint: React Server Components, Actions hook ecosystem, state management patterns, JWT security, and Web Performance Core Web Vitals.",
        "<b>COURSE:</b> Software Engineering & Web Architecture &nbsp;|&nbsp; <b>TARGET:</b> Frontend/Full-Stack SDE Roles & Production Apps",
        st
    )
    story.append(banner)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. React 19 Paradigm Shift & Action Hooks Ecosystem", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    react_hooks = [
        ("React 19 Primitive", "Purpose & Execution Context", "Code Pattern", "Replaces Legacy Pattern"),
        ("useActionState", "Manages async action pending states, form submission, and returned data.", "const [state, formAction, isPending] = useActionState(fn, init)", "Eliminates manual useState(loading), useState(error), and try/catch handlers."),
        ("useOptimistic", "Instantly reflects optimistic UI updates during background server mutations.", "const [optList, setOptList] = useOptimistic(list, (state, update) =&gt; ...)", "Replaces manual rollback state variables and complex local cache sync."),
        ("useFormStatus", "Provides form status (pending, method, data) to child components without prop drilling.", "const { pending } = useFormStatus(); return &lt;button disabled={pending}&gt;", "Replaces passing isSubmitting prop down through form button hierarchies."),
        ("Server Components (RSC)", "Executes exclusively on node server; zero JS sent to client bundle.", "async function Page() { const data = await db.query(); return &lt;div&gt;... }", "Replaces client-side useEffect() data fetching waterfall on initial load.")
    ]
    r_data = []
    for r_idx, row in enumerate(react_hooks):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        r_data.append(p_row)

    table1 = Table(r_data, colWidths=[105, 140, 145, 133])
    table1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table1)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Full-Stack Security & API Architecture Guidelines", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    sec_rows = [
        ("Architecture Layer", "Security & Reliability Standard", "Failure Mode / Vulnerability Prevented"),
        ("Authentication", "Short-lived JWT access tokens (15m in memory) + HttpOnly SameSite=Strict refresh cookies.", "Prevents XSS token exfiltration; eliminates CSRF via SameSite cookie isolation."),
        ("Database Mutations", "Strict Mongoose validation, prepared statements, and optimistic locking (__v).", "Prevents SQL/NoSQL injection and concurrent lost-update write anomalies."),
        ("Rate Limiting", "Token bucket IP & user rate limiting (Express rate-limit / Redis) on auth & search endpoints.", "Prevents brute-force credential stuffing and DoS scraping floods."),
        ("Static Assets & Caching", "Immutable Cache-Control headers with content-hash filenames (Vite dist).", "Guarantees 100% cache hit ratio on CDN without serving stale application bundles.")
    ]
    s_data = []
    for r_idx, row in enumerate(sec_rows):
        p_row = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0: p_row.append(Paragraph(cell, st['th']))
            elif c_idx == 0: p_row.append(Paragraph(cell, st['td_bold']))
            else: p_row.append(Paragraph(cell, st['td']))
        s_data.append(p_row)

    table2 = Table(s_data, colWidths=[110, 220, 193])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), st['forest']),
        ('GRID', (0, 0), (-1, -1), 0.5, st['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF7F2")]),
    ]))
    story.append(table2)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. Core Web Vitals (CWV) & Performance Standards", st['heading']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=st['terracotta'], spaceBefore=1, spaceAfter=5))

    chk = make_checklist_box([
        "<b>Largest Contentful Paint (LCP &lt; 2.5s):</b> Preload hero images using <code>&lt;link rel='preload' as='image'&gt;</code>; avoid rendering hero images behind client-side waterfalls.",
        "<b>Interaction to Next Paint (INP &lt; 200ms):</b> Yield long CPU tasks using <code>scheduler.yield()</code> or <code>setTimeout(0)</code>; optimize heavy re-renders with React 19 transitions.",
        "<b>Cumulative Layout Shift (CLS &lt; 0.1):</b> Always set explicit <code>width</code>, <code>height</code>, or <code>aspect-ratio</code> on images and dynamic embeds to avoid layout reflows.",
        "<b>Anti-Flash Theme Script:</b> Inline early DOM attribute setters (e.g. <code>document.documentElement.setAttribute('data-theme', theme)</code>) in <code>&lt;head&gt;</code> before CSS paints."
    ], st)
    story.append(chk)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {output_path}")


def main():
    dest_dir = "frontend/public/notes"
    os.makedirs(dest_dir, exist_ok=True)

    print("Generating comprehensive publication-grade Study Vault PDFs...")
    build_dsa_guide(os.path.join(dest_dir, "dsa_leetcode_150_cheatsheet.pdf"))
    build_system_design_guide(os.path.join(dest_dir, "system_design_hld_handbook.pdf"))
    build_ml_guide(os.path.join(dest_dir, "machine_learning_math_formulas.pdf"))
    build_os_dbms_guide(os.path.join(dest_dir, "operating_systems_dbms_capsule.pdf"))
    build_gate_cs_guide(os.path.join(dest_dir, "gate_cs_solved_papers.pdf"))
    build_gate_cs_guide(os.path.join(dest_dir, "gate_cs_solved_question_bank.pdf"))
    build_quant_guide(os.path.join(dest_dir, "quantitative_aptitude_speed_math.pdf"))
    build_fullstack_guide(os.path.join(dest_dir, "fullstack_react19_architecture.pdf"))
    print("All 8 PDFs successfully generated and placed in frontend/public/notes!")


if __name__ == '__main__':
    main()
