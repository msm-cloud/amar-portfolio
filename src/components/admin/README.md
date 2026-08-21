# components/admin/

Components specific to the admin panel - unlike `components/ui/`, these
know about admin concerns (forms tied to a specific Server Action,
content-management workflows) and aren't meant to be reused on public
pages.

- `RichTextEditor` — the Tiptap editor + toolbar itself, shared by every
  form below that has a "Content" field. Not tied to any one Server
  Action - just `{ content, onChange }`.
- `TagInput` — type-and-press-Enter multi-tag chip input for a `text[]`
  column (e.g. `projects.tags`). Serializes to a comma-separated hidden
  input; the receiving Server Action splits it back into an array.
- `BlogPostForm` — shared create/edit form for blog posts (`RichTextEditor`,
  slug auto-generation, draft/published toggle). Used by both
  `src/app/admin/blog/new/page.tsx` and `src/app/admin/blog/[id]/edit/page.tsx`.
- `ProjectForm` — shared create/edit form for projects (`RichTextEditor`,
  `TagInput`, slug auto-generation, category combobox with free-text
  fallback, featured/draft/published toggles). Used by both
  `src/app/admin/projects/new/page.tsx` and
  `src/app/admin/projects/[id]/edit/page.tsx`.
- `ProficiencyLevelInput` — clickable 1-5 dot picker for
  `skills.proficiency_level`, styled to match the public `ProficiencyDots`
  (`components/ui/`) but interactive. Kept separate from that component
  since it's a public, presentational-only primitive.
- `SkillForm` / `ExperienceForm` / `CertificationForm` / `TestimonialForm`
  — shared create/edit forms for the simpler content types (no rich text,
  no detail page). `ExperienceForm`'s "Currently Working Here" toggle
  disables-and-clears the End Date field when turned on. All four follow
  the same `useActionState` + `.bind(null, id)` pattern as `ProjectForm`.
- `SiteSettingsForm` — single form (no `mode`/create-vs-edit split; there's
  only ever the one `site_settings` row) for the Hero/About sections'
  content, plus a profile photo `<input type="file">` with an image
  preview. Every field is controlled, not `defaultValue` - see the note
  in `admin/settings/page.tsx`'s own directory for why that matters more
  here than in the other forms above.
