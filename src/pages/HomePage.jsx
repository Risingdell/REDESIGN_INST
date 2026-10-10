import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { Hero } from '@/features/home/Hero';
import { ChapterNav } from '@/features/home/ChapterNav';
import { StartHere } from '@/features/home/StartHere';
import { FitFinder } from '@/features/home/FitFinder';
import { DayStory } from '@/features/home/DayStory';
import {
  AdmissionsJourney,
  HospitalSection,
  InstitutionsRail,
  MissionVision,
  NewsSection,
  StatsStrip,
  WhyKanachur,
} from '@/features/home/sections';
import { VirtualTour } from '@/features/tour/VirtualTour';
import { Testimonials } from '@/features/community/Testimonials';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import '@/features/home/home.css';

/** Separates sections with a hairline and a label instead of a colour band. */
function Divider({ icon, label }) {
  return (
    <div className="container divider" role="separator">
      <Icon name={icon} size={16} /> {label} <Icon name={icon} size={16} />
    </div>
  );
}

/*
 * Every section is white (client rule), so no two neighbours share a layout:
 * bento → split → statement → rail → tabbed split → hover grid → sticky story
 * → steps → framed tour → card grid → carousel → split cards.
 */
export default function HomePage() {
  useDocumentMeta({
    title: '',
    description:
      'Kanachur Islamic Education Trust (R), Mangaluru — medicine, nursing, physiotherapy, allied health, Ayurveda and pharmacy education with a 24×7 teaching hospital.',
  });

  return (
    <>
      <Hero />
      <ChapterNav />
      <StartHere />
      <WhyKanachur />
      <StatsStrip />
      <InstitutionsRail />
      <FitFinder />
      <Divider icon="stethoscope" label="Kanachur Hospital & Research Centre" />
      <HospitalSection />
      <DayStory />
      <AdmissionsJourney />

      <section className="section" id="campus" aria-labelledby="tour-title">
        <div className="container">
          <SectionHeader
            index="08"
            id="tour-title"
            eyebrow="Virtual campus tour"
            title="Walk our campus from *anywhere*."
            lead="Tap the glowing points to learn about each place, or book an in-person visit."
          />
          <VirtualTour compact />
        </div>
      </section>

      <NewsSection />

      <section className="section" id="stories" aria-labelledby="stories-title">
        <div className="container">
          <SectionHeader
            index="10"
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

      <Divider icon="heart" label="Our purpose" />
      <MissionVision />
    </>
  );
}
