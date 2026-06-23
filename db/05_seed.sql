-- =====================================================================
--  05_seed.sql — Baseline reference data (roles, permissions, demo org)
-- =====================================================================
BEGIN;

INSERT INTO organizations (name, slug, legal_name) VALUES
  ('منصة الاستثمار المجتمعي', 'cmip', 'Community Micro-Investment Platform');

INSERT INTO roles (organization_id, code, name, is_system, description) VALUES
  (NULL,'investor','مستثمر',TRUE,'يستعرض ويستثمر في المشاريع'),
  (NULL,'project_owner','صاحب مشروع',TRUE,'ينشئ ويدير مشاريعه'),
  (NULL,'platform_admin','مدير المنصة',TRUE,'يدير المنصة بالكامل'),
  (NULL,'finance_officer','مسؤول مالي',TRUE,'يدير المحافظ والتوزيعات'),
  (NULL,'auditor','مراقب',TRUE,'وصول للقراءة والتدقيق');

INSERT INTO permissions (code, description, module) VALUES
  ('projects.view','عرض المشاريع','projects'),
  ('projects.create','إنشاء مشروع','projects'),
  ('projects.approve','اعتماد ونشر مشروع','projects'),
  ('projects.delete','حذف مشروع','projects'),
  ('investments.create','تنفيذ استثمار','investments'),
  ('investments.view_all','عرض جميع الاستثمارات','investments'),
  ('wallets.manage','إدارة المحافظ','finance'),
  ('wallets.withdraw','سحب من المحفظة','finance'),
  ('profit.distribute','توزيع الأرباح','finance'),
  ('users.manage','إدارة المستخدمين','users'),
  ('audit.view','عرض سجل التدقيق','admin');

COMMIT;
