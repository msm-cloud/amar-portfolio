'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import { compressImage } from '@/lib/compress-image';
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES } from '@/lib/profile-photo';
import {
  updateSiteSettings,
  type SettingsFormState,
} from '@/server/actions/settings';
import type { Database } from '@/types/database';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

const initialState: SettingsFormState = { status: 'idle', message: null };

function StatFieldset({
  index,
  value,
  label,
  valueBn,
  labelBn,
  onValueChange,
  onLabelChange,
  onValueBnChange,
  onLabelBnChange,
}: {
  index: 1 | 2 | 3;
  value: string;
  label: string;
  valueBn: string;
  labelBn: string;
  onValueChange: (v: string) => void;
  onLabelChange: (v: string) => void;
  onValueBnChange: (v: string) => void;
  onLabelBnChange: (v: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-medium text-muted-foreground">
        Stat {index}
      </legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Value"
          name={`stat_${index}_value`}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
        <Input
          label="Label"
          name={`stat_${index}_label`}
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
        />
        <Input
          label="Value (Bangla, optional)"
          name={`stat_${index}_value_bn`}
          value={valueBn}
          onChange={(e) => onValueBnChange(e.target.value)}
        />
        <Input
          label="Label (Bangla, optional)"
          name={`stat_${index}_label_bn`}
          value={labelBn}
          onChange={(e) => onLabelBnChange(e.target.value)}
        />
      </div>
    </fieldset>
  );
}

export function SiteSettingsForm({
  settings,
}: {
  settings: SiteSettingsRow;
}) {
  const [state, formAction] = useActionState(
    updateSiteSettings,
    initialState
  );

  // Controlled throughout, not uncontrolled/defaultValue - React's
  // <form action={...}> resets uncontrolled fields once the action
  // completes regardless of success/failure (the same issue found and
  // fixed in Contact.tsx and BlogPostForm.tsx). Losing a half-edited bio
  // to a "Full name is required" error would be exactly that bug.
  const [fullName, setFullName] = useState(settings.full_name);
  const [fullNameBn, setFullNameBn] = useState(settings.full_name_bn ?? '');
  const [tagline, setTagline] = useState(settings.tagline ?? '');
  const [taglineBn, setTaglineBn] = useState(settings.tagline_bn ?? '');
  const [heroDescription, setHeroDescription] = useState(
    settings.hero_description ?? ''
  );
  const [heroDescriptionBn, setHeroDescriptionBn] = useState(
    settings.hero_description_bn ?? ''
  );
  const [aboutBio, setAboutBio] = useState(settings.about_bio ?? '');
  const [aboutBioBn, setAboutBioBn] = useState(settings.about_bio_bn ?? '');

  const [stat1Value, setStat1Value] = useState(settings.stat_1_value ?? '');
  const [stat1Label, setStat1Label] = useState(settings.stat_1_label ?? '');
  const [stat1ValueBn, setStat1ValueBn] = useState(
    settings.stat_1_value_bn ?? ''
  );
  const [stat1LabelBn, setStat1LabelBn] = useState(
    settings.stat_1_label_bn ?? ''
  );

  const [stat2Value, setStat2Value] = useState(settings.stat_2_value ?? '');
  const [stat2Label, setStat2Label] = useState(settings.stat_2_label ?? '');
  const [stat2ValueBn, setStat2ValueBn] = useState(
    settings.stat_2_value_bn ?? ''
  );
  const [stat2LabelBn, setStat2LabelBn] = useState(
    settings.stat_2_label_bn ?? ''
  );

  const [stat3Value, setStat3Value] = useState(settings.stat_3_value ?? '');
  const [stat3Label, setStat3Label] = useState(settings.stat_3_label ?? '');
  const [stat3ValueBn, setStat3ValueBn] = useState(
    settings.stat_3_value_bn ?? ''
  );
  const [stat3LabelBn, setStat3LabelBn] = useState(
    settings.stat_3_label_bn ?? ''
  );

  // Photo is the one field that's fine to leave as an uncontrolled
  // <input type="file"> (browsers don't allow setting a file input's
  // value programmatically anyway) - only its preview needs state.
  const [photoPreview, setPhotoPreview] = useState(
    settings.profile_photo_url
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    setPhotoError(null);

    // Reject oversized files immediately, before even attempting the
    // upload - server/actions/settings.ts enforces the same limit as the
    // real gate, this is just faster feedback. (Type is also
    // server-checked; the `accept` attribute above only *suggests* a
    // filter, it doesn't enforce one - most OS file pickers still let a
    // user override it.)
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError(
        `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB - photos must be under 5MB.`
      );
      input.value = '';
      return;
    }
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError('Photo must be a JPEG, PNG, WebP, or GIF image.');
      input.value = '';
      return;
    }

    setIsCompressingPhoto(true);
    // Resize/re-encode client-side before upload, so a multi-MB phone
    // photo doesn't get stored at full resolution for what's displayed
    // as a small circle - see compress-image.ts for the fallback
    // behavior if this fails for any reason.
    const processedFile = await compressImage(file);
    setIsCompressingPhoto(false);

    // The <input>'s own FileList is what actually gets submitted with
    // the form - swap it to the (possibly compressed) file via
    // DataTransfer so the upload uses that version, not the original.
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(processedFile);
    input.files = dataTransfer.files;

    // Revoke the previous object URL (if any) before creating a new one,
    // so switching the file twice in a row doesn't leak the first blob.
    if (photoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(URL.createObjectURL(processedFile));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt=""
              unoptimized
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <User className="h-8 w-8" aria-hidden />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="photo"
            className="text-sm font-medium text-muted-foreground"
          >
            Profile Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoChange}
            disabled={isCompressingPhoto}
            className="text-sm text-foreground file:mr-3 file:rounded-lg file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted"
          />
          {isCompressingPhoto ? (
            <p className="text-xs text-muted-foreground">
              Compressing image…
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP, or GIF, up to 5MB. Leave blank to keep the
              current photo.
            </p>
          )}
          {photoError && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {photoError}
            </p>
          )}
        </div>
      </div>

      <Input
        label="Full Name"
        name="full_name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        maxLength={150}
      />
      <Input
        label="Full Name (Bangla, optional)"
        name="full_name_bn"
        value={fullNameBn}
        onChange={(e) => setFullNameBn(e.target.value)}
      />

      <Input
        label="Tagline"
        name="tagline"
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        placeholder="Web Developer & Graphic Designer — Building Digital Solutions for Financial Institutions"
      />
      <Textarea
        label="Tagline (Bangla, optional)"
        name="tagline_bn"
        value={taglineBn}
        onChange={(e) => setTaglineBn(e.target.value)}
        rows={2}
      />

      <Textarea
        label="Hero Description"
        name="hero_description"
        value={heroDescription}
        onChange={(e) => setHeroDescription(e.target.value)}
        rows={3}
      />
      <Textarea
        label="Hero Description (Bangla, optional)"
        name="hero_description_bn"
        value={heroDescriptionBn}
        onChange={(e) => setHeroDescriptionBn(e.target.value)}
        rows={3}
      />

      <Textarea
        label="About Bio"
        name="about_bio"
        value={aboutBio}
        onChange={(e) => setAboutBio(e.target.value)}
        rows={5}
      />
      <Textarea
        label="About Bio (Bangla, optional)"
        name="about_bio_bn"
        value={aboutBioBn}
        onChange={(e) => setAboutBioBn(e.target.value)}
        rows={5}
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          About Section Stats
        </h2>
        <StatFieldset
          index={1}
          value={stat1Value}
          label={stat1Label}
          valueBn={stat1ValueBn}
          labelBn={stat1LabelBn}
          onValueChange={setStat1Value}
          onLabelChange={setStat1Label}
          onValueBnChange={setStat1ValueBn}
          onLabelBnChange={setStat1LabelBn}
        />
        <StatFieldset
          index={2}
          value={stat2Value}
          label={stat2Label}
          valueBn={stat2ValueBn}
          labelBn={stat2LabelBn}
          onValueChange={setStat2Value}
          onLabelChange={setStat2Label}
          onValueBnChange={setStat2ValueBn}
          onLabelBnChange={setStat2LabelBn}
        />
        <StatFieldset
          index={3}
          value={stat3Value}
          label={stat3Label}
          valueBn={stat3ValueBn}
          labelBn={stat3LabelBn}
          onValueChange={setStat3Value}
          onLabelChange={setStat3Label}
          onValueBnChange={setStat3ValueBn}
          onLabelBnChange={setStat3LabelBn}
        />
      </div>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
      {state.status === 'success' && (
        <p role="status" className="text-sm text-primary">
          {state.message}
        </p>
      )}

      <SubmitButton pendingChildren="Saving…" className="w-fit">
        Save Changes
      </SubmitButton>
    </form>
  );
}
