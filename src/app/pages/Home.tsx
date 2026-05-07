import { HeroSection } from '../components/home/HeroSection';
import { CategoryNavigation } from '../components/home/CategoryNavigation';
import { FeaturedKits } from '../components/home/FeaturedKits';
import { BestSellers } from '../components/home/BestSellers';
import { HowItWorks } from '../components/home/HowItWorks';
import { TrustSection } from '../components/home/TrustSection';
import { StoreMap } from '../components/home/StoreMap';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryNavigation />
      <FeaturedKits />
      <BestSellers />
      <HowItWorks />
      <TrustSection />
      <StoreMap />
    </div>
  );
}
