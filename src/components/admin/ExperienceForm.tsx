'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import {
  createExperience,
  updateExperience,
  type ExperienceFormState,
} from '@/server/actions/experience';
import type { Database } from '@/types/database';

type ExperienceRow = Database['public']['Tables']['experience']['Row'];

const initialState: ExperienceFormState = { status: 'idle', message: null };

export function ExperienceForm({
  mode,
  experience,
}: {
  mode: 'create' | 'edit';
  experience?: ExperienceRow;
}) {
  // updateExperience takes `id` as its first argument, ahead of the
  // (prevState, formData) pair useActionState expects - bind it here, same
  // pattern as every other admin form.
  const action =
    mode === 'edit' && experience
      ? updateExperience.bind(null, experience.id)
      : createExperience;
  const [state, formAction] = useActionState(action, initialState);

  const [title, setTitle] = useState(experience?.title ?? '');
  const [titleBn, setTitleBn] = useState(experience?.title_bn ?? '');
  const [organization, setOrganization] = useState(
    experience?.organization ?? ''
  );
  const [organizationBn, setOrganizationBn] = useState(
    experience?.organization_bn ?? ''
  );
  const [description, setDescription] = useState(
    experience?.description ?? ''
  );
  const [descriptionBn, setDescriptionBn] = useState(
    experience?.description_bn ?? ''
  );
  const [startDate, setStartDate] = useState(experience?.start_date ?? '');
  const [endDate, setEndDate] = useState(experience?.end_date ?? '');
  const [isCurrent, setIsCurrent] = useState(
    experience?.is_current ?? false
  );
  const [displayOrder, setDisplayOrder] = useState(
    experience?.display_order ?? 0
  );

  function handleIsCurrentChange(next: boolean) {
    setIsCurrent(next);
    // A current role has no end date - clear it client-side too, not just
    // server-side, so the (now-disabled) field doesn't show a stale date.
    if (next) setEndDate('');
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="is_current" value={isCurrent ? 'true' : 'false'} />

      <Input
        label="Job Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={150}
      />
      <Textarea
        label="Job Title (Bangla, optional)"
        name="title_bn"
        value={titleBn}
        onChange={(e) => setTitleBn(e.target.value)}
        rows={2}
      />

      <Input
        label="Organization"
        name="organization"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        required
        maxLength={150}
      />
      <Textarea
        label="Organization (Bangla, optional)"
        name="organization_bn"
        value={organizationBn}
        onChange={(e) => setOrganizationBn(e.target.value)}
        rows={2}
      />

      <Textarea
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <Textarea
        label="Description (Bangla, optional)"
        name="description_bn"
        value={descriptionBn}
        onChange={(e) => setDescriptionBn(e.target.value)}
        rows={4}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Start Date"
          name="start_date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="End Date"
          name="end_date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={isCurrent}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-muted-foreground">
          Currently Working Here
        </legend>
        <div className="flex w-fit rounded-lg border border-border p-1">
          {(
            [
              { value: false, label: 'No' },
              { value: true, label: 'Yes' },
            ] as const
          ).map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => handleIsCurrentChange(option.value)}
              aria-pressed={isCurrent === option.value}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isCurrent === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

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
        {mode === 'create' ? 'Create Experience' : 'Save Changes'}
      </SubmitButton>
    </form>
  );
}
