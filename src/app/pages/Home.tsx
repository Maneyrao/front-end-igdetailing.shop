import { HeroSection } from '../components/home/HeroSection';
import { CategoryNavigation } from '../components/home/CategoryNavigation';
import { FeaturedKits } from '../components/home/FeaturedKits';
import { BestSellers } from '../components/home/BestSellers';
import { TrustSection } from '../components/home/TrustSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryNavigation />
      <FeaturedKits />
      <BestSellers />
      <TrustSection />
    </div>
  );
}
