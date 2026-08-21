-- supabase/seed_skills.sql
--
-- One-time seed: inserts the same skills that used to live as static
-- placeholder data (src/components/sections/Skills.tsx, now reading
-- Supabase) as real rows in the `skills` table.
--
-- Run once via the Supabase Dashboard: SQL Editor -> New query -> paste
-- this entire file -> Run.
--
-- Unlike seed_projects.sql, this can't use `on conflict (slug) do
-- nothing` - skills has no natural unique column to conflict on. Instead
-- the whole insert is wrapped in a check that only runs it if the table
-- is currently empty, so it's still safe to paste and run more than once
-- by accident (it just won't do anything the second time).
--
-- icon_name must match a real lucide-react icon name - see the ICON_MAP
-- in src/components/sections/skills-grid.tsx for which names it
-- recognizes today (anything else falls back to a generic icon, it won't
-- error).

do $$
begin
  if not exists (select 1 from public.skills limit 1) then
    insert into public.skills (name, category, proficiency_level, icon_name, display_order) values
      ('React', 'Frontend', 5, 'Atom', 1),
      ('Next.js', 'Frontend', 5, 'Triangle', 2),
      ('TypeScript', 'Frontend', 4, 'FileCode2', 3),
      ('Tailwind CSS', 'Frontend', 5, 'Wind', 4),

      ('Node.js', 'Backend', 4, 'Server', 5),
      ('PostgreSQL', 'Backend', 4, 'Database', 6),
      ('Supabase', 'Backend', 4, 'DatabaseZap', 7),

      ('Figma', 'Design', 5, 'PenTool', 8),
      ('Photoshop', 'Design', 4, 'Image', 9),
      ('Illustrator', 'Design', 4, 'Paintbrush', 10),
      ('UI/UX Design', 'Design', 5, 'Palette', 11),

      ('Git', 'Tools & Other', 4, 'GitBranch', 12),
      ('Excel / Data Analysis', 'Tools & Other', 4, 'FileSpreadsheet', 13),
      ('MS Office', 'Tools & Other', 4, 'Briefcase', 14),
      ('Banking Operations Software', 'Tools & Other', 3, 'Landmark', 15);
  end if;
end $$;
