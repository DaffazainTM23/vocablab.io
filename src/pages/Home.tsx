import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { PopularTopics } from '../components/home/PopularTopics';
import { QuickQuiz } from '../components/home/QuickQuiz';
import { Testimonials } from '../components/home/Testimonials';

export function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <PopularTopics />
      <QuickQuiz />
      <Testimonials />
    </div>
  );
}
