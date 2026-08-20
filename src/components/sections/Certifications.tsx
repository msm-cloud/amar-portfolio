'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { buttonVariants } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import {
  formatMonthYear,
  getCertificationIcon,
  pickBilingual,
  PLACEHOLDER_CERTIFICATIONS,
} from '@/lib/placeholder-data';

export function Certifications() {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <SectionContainer id="certifications">
      <SectionHeading
        eyebrow={t('certifications.eyebrow')}
        title={t('certifications.title')}
      />

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {PLACEHOLDER_CERTIFICATIONS.map((cert) => {
          const Icon = getCertificationIcon(cert);
          const title = pickBilingual(cert.title, cert.title_bn, language);
          const organization = pickBilingual(
            cert.issuing_organization,
            cert.issuing_organization_bn,
            language
          );

          return (
            <motion.div key={cert.id} variants={fadeInUp}>
              <BentoCard className="flex h-full flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {organization}
                  </p>
                  {cert.issue_date && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatMonthYear(cert.issue_date)}
                    </p>
                  )}
                </div>

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                      className: 'w-fit',
                    })}
                  >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    {t('certifications.viewCredential')}
                  </a>
                )}
              </BentoCard>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
}
