import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { Hero } from '@/features/home/Hero';
import { StartHere } from '@/features/home/StartHere';
import { FitFinder } from '@/features/home/FitFinder';
import {
  AdmissionsJourney,
  HospitalBand,
  InstitutionsExplorer,
  MissionVision,
  NewsSection,
  WhyKanachur,
} from '@/features/home/sections';
import { VirtualTour } from '@/features/tour/VirtualTour';
import { Testimonials } from '@/features/community/Testimonials';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import '@/features/home/home.css';

export default function HomePage() {
  useDocumentMeta({
    title: '',
    description:
      'Kanachur Islamic Education Trust (R), Mangaluru — medicine, nursing, physiotherapy, allied health, Ayurveda and pharmacy education with a 24×7 teaching hospital.',
  });

  return (
    <>
      <Hero />
      <StartHere />
      <WhyKanachur />
      <InstitutionsExplorer />
      <FitFinder />
      <HospitalBand />
      <AdmissionsJourney />

      <section className="section section--tint" aria-labelledby="tour-title">
        <div className="container">
          <SectionHeader
            id="tour-title"
            eyebrow="Virtual campus tour"
            title="Walk our campus from *anywhere*."
            lead="Tap the glowing points to learn about each place, or book an in-person visit."
          />
          <VirtualTour compact />
        </div>
      </section>

      <NewsSection />

      <section className="section" aria-labelledby="stories-title">
        <div className="container">
          <SectionHeader
            id="stories-title"
            eyebrow="Community voices"
            title="Stories from our *alumni*."
            actions={
              <Button to="/alumni#share" variant="outline" iconLeft="edit">
                Share your story
              </Button>
            }
          />
          <Testimonials />
        </div>
      </section>

      <MissionVision />
    </>
  );
}
