'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import {
  createCertification,
  updateCertification,
  type CertificationFormState,
} from '@/server/actions/certifications';
import type { Database } from '@/types/database';

type CertificationRow = Database['public']['Tables']['certifications']['Row'];

const initialState: CertificationFormState = { status: 'idle', message: null };

export function CertificationForm({
  mode,
  certification,
}: {
  mode: 'create' | 'edit';
  certification?: CertificationRow;
}) {
  // updateCertification takes `id` as its first argument, ahead of the
  // (prevState, formData) pair useActionState expects - bind it here, same
  // pattern as every other admin form.
  const action =
    mode === 'edit' && certification
      ? updateCertification.bind(null, certification.id)
      : createCertification;
  const [state, formAction] = useActionState(action, initialState);

  const [title, setTitle] = useState(certification?.title ?? '');
  const [titleBn, setTitleBn] = useState(certification?.title_bn ?? '');
  const [issuingOrganization, setIssuingOrganization] = useState(
    certification?.issuing_organization ?? ''
  );
  const [issuingOrganizationBn, setIssuingOrganizationBn] = useState(
    certification?.issuing_organization_bn ?? ''
  );
  const [issueDate, setIssueDate] = useState(
    certification?.issue_date ?? ''
  );
  const [credentialUrl, setCredentialUrl] = useState(
    certification?.credential_url ?? ''
  );
  const [imageUrl, setImageUrl] = useState(certification?.image_url ?? '');
  const [displayOrder, setDisplayOrder] = useState(
    certification?.display_order ?? 0
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Input
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={200}
      />
      <Textarea
        label="Title (Bangla, optional)"
        name="title_bn"
        value={titleBn}
        onChange={(e) => setTitleBn(e.target.value)}
        rows={2}
      />

      <Input
        label="Issuing Organization"
        name="issuing_organization"
        value={issuingOrganization}
        onChange={(e) => setIssuingOrganization(e.target.value)}
        required
        maxLength={200}
      />
      <Textarea
        label="Issuing Organization (Bangla, optional)"
        name="issuing_organization_bn"
        value={issuingOrganizationBn}
        onChange={(e) => setIssuingOrganizationBn(e.target.value)}
        rows={2}
      />

      <Input
        label="Issue Date"
        name="issue_date"
        type="date"
        value={issueDate ?? ''}
        onChange={(e) => setIssueDate(e.target.value)}
      />
      <Input
        label="Credential URL (optional)"
        name="credential_url"
        type="url"
        placeholder="https://…"
        value={credentialUrl ?? ''}
        onChange={(e) => setCredentialUrl(e.target.value)}
      />
      <Input
        label="Image/Icon URL (optional)"
        name="image_url"
        type="url"
        placeholder="https://…"
        value={imageUrl ?? ''}
        onChange={(e) => setImageUrl(e.target.value)}
      />
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
        {mode === 'create' ? 'Create Certification' : 'Save Changes'}
      </SubmitButton>
    </form>
  );
}
