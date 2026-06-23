'use client';
import { useState } from 'react';
import { projects } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';

const filters = [
  { k: 'all', t: 'الكل' },
  { k: 'open', t: 'مفتوح' },
  { k: 'in_progress', t: 'قيد التنفيذ' },
  { k: 'completed', t: 'مكتمل' },
];

export default function ProjectsPage() {
  const [f, setF] = useState('all');
  const list = f === 'all' ? projects : projects.filter((p) => p.status === f);
  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-bold">المشاريع المتاحة</h1>
      <p className="mt-2 text-gray-500">استعرض المشاريع المعتمدة وادعمها باستثمار تجريبي.</p>
      <div className="my-6 flex flex-wrap gap-2">
        {filters.map((x) => (
          <button key={x.k} onClick={() => setF(x.k)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${f === x.k ? 'bg-trust text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{x.t}</button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <ProjectCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
