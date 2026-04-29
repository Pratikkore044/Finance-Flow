import CTA from "../components/landing/CTA";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Navbar from "../components/landing/Navbar";
import Stats from "../components/landing/Stats";


  const HomePage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main flex flex-col min-h-screen overflow-x-hidden font-body">
      <Navbar />
      <main className="flex-grow pt-20">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <CTA/>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;