// Demo seed data — simulation only, not a real financial system.
export const projects = [
  {
    id: 'p1',
    title: 'مخبز الحي التعاوني',
    owner: 'أم محمد الزهراني',
    ownerBio: 'سيدة أعمال ناشئة تدير مخبزاً منزلياً وتسعى للتوسع.',
    category: 'أغذية',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=70',
    short: 'دعم مخبز محلي لتوظيف 6 نساء من الفئات الهشة.',
    description:
      'مشروع تعاوني لتوسعة مخبز محلي يوفر فرص عمل لنساء معيلات. التمويل يغطي معدات الخبز وتجهيز موقع جديد، مع خطة لتدريب 6 موظفات خلال 3 أشهر.',
    targetAmount: 120000,
    fundedAmount: 78000,
    totalShares: 1200,
    sharePrice: 100,
    status: 'open',
  },
  {
    id: 'p2',
    title: 'مزرعة الخضار العمودية',
    owner: 'فهد العتيبي',
    ownerBio: 'مهندس زراعي شاب يطبق تقنيات الزراعة المستدامة.',
    category: 'زراعة',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=70',
    short: 'زراعة عمودية موفرة للمياه داخل المدينة.',
    description:
      'إنشاء وحدة زراعة عمودية توفر 90% من المياه وتنتج خضاراً طازجة على مدار العام، مع توظيف شباب المنطقة وتدريبهم على التقنيات الحديثة.',
    targetAmount: 200000,
    fundedAmount: 200000,
    totalShares: 2000,
    sharePrice: 100,
    status: 'completed',
  },
  {
    id: 'p3',
    title: 'ورشة الحرف اليدوية',
    owner: 'نورة القحطاني',
    ownerBio: 'حرفية تقود مجموعة من السيدات لإنتاج منتجات تراثية.',
    category: 'حرف',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=70',
    short: 'تمكين 10 حرفيات من تسويق منتجاتهن.',
    description:
      'دعم ورشة حرف يدوية تراثية لتمكين سيدات من إنتاج وتسويق منتجاتهن محلياً ودولياً عبر منصات إلكترونية.',
    targetAmount: 90000,
    fundedAmount: 34000,
    totalShares: 900,
    sharePrice: 100,
    status: 'open',
  },
  {
    id: 'p4',
    title: 'مركز تدريب تقني للشباب',
    owner: 'سعد الدوسري',
    ownerBio: 'مدرب معتمد في البرمجة والمهارات الرقمية.',
    category: 'تعليم',
    image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&q=70',
    short: 'تدريب 50 شاباً على المهارات الرقمية.',
    description:
      'مركز تدريب يقدم برامج في البرمجة والتصميم لتأهيل الشباب لسوق العمل الرقمي، مع شراكات توظيف.',
    targetAmount: 150000,
    fundedAmount: 96000,
    totalShares: 1500,
    sharePrice: 100,
    status: 'in_progress',
  },
];

export const stats = {
  totalProjects: projects.length,
  totalInvestors: 1248,
  totalFunding: projects.reduce((s, p) => s + p.fundedAmount, 0),
  activeProjects: projects.filter((p) => p.status === 'open' || p.status === 'in_progress').length,
};

export const users = [
  { id: 'u1', name: 'مستثمر تجريبي', email: 'investor@demo.com', role: 'investor' },
  { id: 'u2', name: 'صاحب مشروع', email: 'owner@demo.com', role: 'owner' },
  { id: 'u3', name: 'مدير المنصة', email: 'admin@demo.com', role: 'admin' },
];

export const statusLabels = {
  open: { text: 'مفتوح للتمويل', color: 'bg-growth/10 text-growth' },
  completed: { text: 'مكتمل', color: 'bg-trust/10 text-trust' },
  in_progress: { text: 'قيد التنفيذ', color: 'bg-amber-100 text-amber-700' },
  pending: { text: 'قيد المراجعة', color: 'bg-gray-100 text-gray-600' },
};

export function getProject(id) {
  return projects.find((p) => p.id === id);
}
