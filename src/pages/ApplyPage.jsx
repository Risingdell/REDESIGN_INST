import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { ApplyWizard } from '@/features/admissions/ApplyWizard';
import './pages.css';

export default function ApplyPage() {
  useDocumentMeta({
    title: 'Apply online',
    description: 'Apply to Kanachur institutions online in about 10 minutes. Your progress saves automatically.',
  });

  return (
    <>
      <PageHero
        compact
        eyebrow="Online application · 2026–27"
        title="Apply in about *10 minutes*."
        lead="Your progress is saved on this device, so you can stop and come back any time."
        image="/images/campus-aerial.webp"
        crumbs={[{ label: 'Admissions', to: '/admissions' }, { label: 'Apply online' }]}
      />
      <section className="section" style={{ paddingTop: "var(--section-head-gap)" }}>
        <div className="container">
          <ApplyWizard />
        </div>
      </section>
    </>
  );
}
