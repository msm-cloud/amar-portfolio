'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { createSkill, updateSkill, type SkillFormState } from '@/server/actions/skills';
import type { Database } from '@/types/database';
import { ProficiencyLevelInput } from './ProficiencyLevelInput';

type SkillRow = Database['public']['Tables']['skills']['Row'];

const initialState: SkillFormState = { status: 'idle', message: null };

// Fixed set, matching the public Skills section's CATEGORY_LABELS_BN
// (Skills.tsx) - not a free-text/custom-value field like Projects'
// category, per the brief.
const CATEGORY_OPTIONS = ['Frontend', 'Backend', 'Design', 'Tools & Other'];

export function SkillForm({
  mode,
  skill,
}: {
  mode: 'create' | 'edit';
  skill?: SkillRow;
}) {
  // updateSkill takes `id` as its first argument, ahead of the
  // (prevState, formData) pair useActionState expects - bind it here so
  // the resulting function matches useActionState's expected shape (same
  // pattern as every other admin form).
  const action =
    mode === 'edit' && skill ? updateSkill.bind(null, skill.id) : createSkill;
  const [state, formAction] = useActionState(action, initialState);

  const [name, setName] = useState(skill?.name ?? '');
  const [category, setCategory] = useState(
    skill?.category ?? CATEGORY_OPTIONS[0]
  );
  const [proficiencyLevel, setProficiencyLevel] = useState(
    skill?.proficiency_level ?? 3
  );
  const [iconName, setIconName] = useState(skill?.icon_name ?? '');
  const [displayOrder, setDisplayOrder] = useState(skill?.display_order ?? 0);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Input
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="category"
          className="text-sm font-medium text-muted-foreground"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category ?? ''}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <ProficiencyLevelInput
        name="proficiency_level"
        value={proficiencyLevel ?? 3}
        onChange={setProficiencyLevel}
      />

      <Input
        label="Icon"
        name="icon_name"
        value={iconName}
        onChange={(e) => setIconName(e.target.value)}
        placeholder="Atom"
      />
      <p className="-mt-4 text-xs text-muted-foreground">
        Must match a lucide-react icon name exactly (case-sensitive), e.g.{' '}
        <code>Atom</code>, <code>Server</code>, <code>PenTool</code>. Falls
        back to a generic icon if left blank or not recognized.
      </p>

      <Input
        label="Display Order"
        name="display_order"
        type="number"
        value={displayOrder}
        onChange={(e) => setDisplayOrder(Number(e.target.value))}
      />

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <SubmitButton pendingChildren="Saving…" className="w-fit">
        {mode === 'create' ? 'Create Skill' : 'Save Changes'}
      </SubmitButton>
    </form>
  );
}
