import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Phases from '../components/Phases';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Quote from '../components/Quote';
import Process from '../components/Process';
import Portfolio from '../components/Portfolio';
import ContactForm from '../components/ContactForm';

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Hero />
      <Phases />
      <AboutUs />
      <Services />
      <Stats />
      <Quote />
      <Process />
      <Portfolio />
      <ContactForm />
    </>
  );
}
