// Demo seed data — simulation only, not a real financial system.
export const projects = [
  {
    id: 'p1', title: 'مخبز الحي التعاوني', owner: 'أم محمد الزهراني',
    ownerBio: 'سيدة أعمال ناشئة تدير مخبزاً منزلياً وتسعى للتوسع.',
    category: 'أغذية', region: 'الرياض', riskLevel: 'منخفض', daysLeft: 18,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=70',
    short: 'دعم مخبز محلي لتوظيف 6 نساء من الفئات الهشة.',
    description: 'مشروع تعاوني لتوسعة مخبز محلي يوفر فرص عمل لنساء معيلات. التمويل يغطي معدات الخبز وتجهيز موقع جديد، مع خطة لتدريب 6 موظفات خلال 3 أشهر.',
    targetAmount: 120000, fundedAmount: 78000, totalShares: 1200, sharePrice: 100, status: 'open',
    beneficiaries: 18, jobs: 6, backers: 142,
    useOfFunds: [ { label: 'معدات وتجهيزات', value: 45 }, { label: 'تأجير الموقع', value: 25 }, { label: 'تدريب الموظفات', value: 20 }, { label: 'تشغيل أولي', value: 10 } ],
    milestones: [ { t: 'تجهيز الموقع', done: true }, { t: 'شراء المعدات', done: true }, { t: 'توظيف وتدريب', done: false }, { t: 'الافتتاح', done: false } ],
  },
  {
    id: 'p2', title: 'مزرعة الخضار العمودية', owner: 'فهد العتيبي',
    ownerBio: 'مهندس زراعي شاب يطبق تقنيات الزراعة المستدامة.',
    category: 'زراعة', region: 'القصيم', riskLevel: 'متوسط', daysLeft: 0,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&q=70',
    short: 'زراعة عمودية موفرة للمياه داخل المدينة.',
    description: 'إنشاء وحدة زراعة عمودية توفر 90% من المياه وتنتج خضاراً طازجة على مدار العام، مع توظيف شباب المنطقة وتدريبهم على التقنيات الحديثة.',
    targetAmount: 200000, fundedAmount: 200000, totalShares: 2000, sharePrice: 100, status: 'completed',
    beneficiaries: 30, jobs: 9, backers: 318,
    useOfFunds: [ { label: 'وحدة الزراعة', value: 55 }, { label: 'أنظمة الري', value: 25 }, { label: 'تشغيل', value: 20 } ],
    milestones: [ { t: 'التصميم', done: true }, { t: 'التركيب', done: true }, { t: 'أول حصاد', done: true }, { t: 'التوسعة', done: false } ],
  },
  {
    id: 'p3', title: 'ورشة الحرف اليدوية', owner: 'نورة القحطاني',
    ownerBio: 'حرفية تقود مجموعة من السيدات لإنتاج منتجات تراثية.',
    category: 'حرف', region: 'عسير', riskLevel: 'منخفض', daysLeft: 27,
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&q=70',
    short: 'تمكين 10 حرفيات من تسويق منتجاتهن.',
    description: 'دعم ورشة حرف يدوية تراثية لتمكين سيدات من إنتاج وتسويق منتجاتهن محلياً ودولياً عبر منصات إلكترونية.',
    targetAmount: 90000, fundedAmount: 34000, totalShares: 900, sharePrice: 100, status: 'open',
    beneficiaries: 22, jobs: 10, backers: 67,
    useOfFunds: [ { label: 'مواد خام', value: 40 }, { label: 'تسويق رقمي', value: 30 }, { label: 'تجهيز الورشة', value: 30 } ],
    milestones: [ { t: 'تجهيز الورشة', done: true }, { t: 'الإنتاج', done: false }, { t: 'إطلاق المتجر', done: false } ],
  },
  {
    id: 'p4', title: 'مركز تدريب تقني للشباب', owner: 'سعد الدوسري',
    ownerBio: 'مدرب معتمد في البرمجة والمهارات الرقمية.',
    category: 'تعليم', region: 'الشرقية', riskLevel: 'متوسط', daysLeft: 9,
    image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=900&q=70',
    short: 'تدريب 50 شاباً على المهارات الرقمية.',
    description: 'مركز تدريب يقدم برامج في البرمجة والتصميم لتأهيل الشباب لسوق العمل الرقمي، مع شراكات توظيف.',
    targetAmount: 150000, fundedAmount: 96000, totalShares: 1500, sharePrice: 100, status: 'in_progress',
    beneficiaries: 50, jobs: 4, backers: 203,
    useOfFunds: [ { label: 'أجهزة ومعمل', value: 50 }, { label: 'مدربون', value: 30 }, { label: 'منصة تعلم', value: 20 } ],
    milestones: [ { t: 'تجهيز المعمل', done: true }, { t: 'الدفعة الأولى', done: true }, { t: 'شراكات توظيف', done: false } ],
  },
];

export const stats = {
  totalProjects: projects.length,
  totalInvestors: 1248,
  totalFunding: projects.reduce((s, p) => s + p.fundedAmount, 0),
  activeProjects: projects.filter((p) => p.status === 'open' || p.status === 'in_progress').length,
  beneficiaries: projects.reduce((s, p) => s + p.beneficiaries, 0),
  jobs: projects.reduce((s, p) => s + p.jobs, 0),
};

export const users = [
  { id: 'u1', name: 'مستثمر تجريبي', email: 'investor@demo.com', role: 'investor', joined: '2025-01' },
  { id: 'u2', name: 'صاحب مشروع', email: 'owner@demo.com', role: 'owner', joined: '2025-02' },
  { id: 'u3', name: 'مدير المنصة', email: 'admin@demo.com', role: 'admin', joined: '2024-12' },
  { id: 'u4', name: 'سارة المطيري', email: 'sara@demo.com', role: 'investor', joined: '2025-03' },
  { id: 'u5', name: 'خالد الحربي', email: 'khaled@demo.com', role: 'owner', joined: '2025-03' },
];

export const statusLabels = {
  open: { text: 'مفتوح للتمويل', color: 'bg-growth-50 text-growth' },
  completed: { text: 'مكتمل', color: 'bg-trust-50 text-trust' },
  in_progress: { text: 'قيد التنفيذ', color: 'bg-amber-50 text-amber-700' },
  pending: { text: 'قيد المراجعة', color: 'bg-gray-100 text-gray-600' },
};

export const roleLabels = { investor: 'مستثمر', owner: 'صاحب مشروع', admin: 'إدارة' };

export function getProject(id) { return projects.find((p) => p.id === id); }
