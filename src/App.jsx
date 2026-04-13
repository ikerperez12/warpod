import React, { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Scene from './Scene';
import KineticScene from './KineticScene';

gsap.registerPlugin(ScrollTrigger);

const FRAMER_EASE_OUT = [0.22, 1, 0.36, 1];
const FRAMER_EASE_OUT_STRONG = [0.16, 1, 0.3, 1];

const FORGE_STACK = [
  { 
    name: 'React 19', 
    icon: 'react___símbolo_de_202604102121.png', 
    desc: 'The reactive heart of our architecture.' 
  },
  { 
    name: 'Three.js', 
    icon: 'javascript___cubo_3d_202604102121.png', 
    desc: 'Bending light and space in WebGL.' 
  },
  { 
    name: 'GSAP Ultra', 
    icon: 'esferas_del_dragón_202604102122.png', 
    desc: 'Orchestrating every frame with precision.' 
  },
  { 
    name: 'Vite Core', 
    icon: 'vite.svg', 
    desc: 'Lightning-fast builds and delivery.' 
  }
];

const SplitText = ({ children }) => {
  return (
    <span aria-label={children} style={{ display: 'inline-block' }}>
      {children.split('').map((char, i) => (
        <span aria-hidden="true" key={i} className="char" style={{ display: 'inline-block', opacity: 0 }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const SplitWords = ({ text }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="scrub-word" style={{ 
          display: 'inline-block', 
          marginRight: '1.5rem', 
          opacity: 0, 
          transform: 'translateZ(-100px)',
          animationDelay: `${i * 0.1}s` 
        }}>
          {word}
        </span>
      ))}
    </>
  );
}

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", {duration: 0.6, ease: "power3.out"});
    const yTo = gsap.quickTo(el, "y", {duration: 0.6, ease: "power3.out"});
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const h = rect.width / 2;
      const w = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - w;
      xTo(x * 0.4);
      yTo(y * 0.4);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);
  return React.cloneElement(children, { ref });
};

export default function App() {
  const containerRef = useRef();
  const curtain1Ref = useRef();
  const curtainMedia1Ref = useRef();
  const curtainText1Ref = useRef();
  
  const curtain2Ref = useRef();
  const curtainMedia2Ref = useRef();
  const curtainText2Ref = useRef();

  const forgeSectionRef = useRef();
  const forgeItemsRef = useRef([]);
  
  const horizontalSectionRef = useRef();
  const horizontalWrapperRef = useRef();
  
  const storySectionRef = useRef();
  const storyTextRef = useRef();
  const storyImgRef = useRef();

  const deckSectionRef = useRef();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const cursorRef = useRef(null);
  
  const ambientSound = useRef(null);
  const hoverSound = useRef(null);

  useEffect(() => {
    ambientSound.current = new Audio('/assets/audio/bg-ambient.mp3');
    ambientSound.current.volume = 0.4;
    ambientSound.current.loop = true;
    hoverSound.current = new Audio('/assets/audio/hover.mp3');
    hoverSound.current.volume = 0.05;
  }, []);

  const playHover = () => {
    if (hoverSound.current) {
      hoverSound.current.currentTime = 0;
      hoverSound.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const playAmbient = () => {
      if (ambientSound.current && ambientSound.current.paused) {
        ambientSound.current.play().then(() => {
          window.removeEventListener('click', playAmbient);
          window.removeEventListener('scroll', playAmbient);
          window.removeEventListener('touchstart', playAmbient);
          window.removeEventListener('mousemove', playAmbient);
        }).catch(() => {});
      }
    };
    window.addEventListener('click', playAmbient);
    window.addEventListener('scroll', playAmbient);
    window.addEventListener('touchstart', playAmbient);
    window.addEventListener('mousemove', playAmbient);
    return () => {
      window.removeEventListener('click', playAmbient);
      window.removeEventListener('scroll', playAmbient);
      window.removeEventListener('touchstart', playAmbient);
      window.removeEventListener('mousemove', playAmbient);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const xTo = gsap.quickTo(cursorRef.current, "x", {duration: 0.15, ease: "power2.out"});
    const yTo = gsap.quickTo(cursorRef.current, "y", {duration: 0.15, ease: "power2.out"});
    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);

    let ctx;
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
           setLoading(false);
           ctx = gsap.context(() => {
             // Hero Title
             gsap.to('.hero-title .char', {
               y: 0, opacity: 1, stagger: 0.05, duration: 1.5, ease: "expo.out", delay: 0.2, force3D: true
             });

             // Marquee
             gsap.to('.marquee-content', {
               xPercent: -50, ease: "none", duration: 25, repeat: -1, force3D: true
             });

             // Scrub Section (STAR WARS PROGRESSIVE EFFECT)
             const scrubWords = gsap.utils.toArray('.scrub-word');
             scrubWords.forEach((word, i) => {
               gsap.fromTo(word, 
                 { opacity: 0, y: 100, scale: 0.5, filter: 'blur(10px)' },
                 { 
                   opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                   scrollTrigger: {
                     trigger: ".scrub-section",
                     start: `top+=${i * 30} center`,
                     end: `top+=${i * 30 + 300} center`,
                     scrub: 1.5
                   }
                 }
               );
             });

             // Curtain 1
             const curtain1Tl = gsap.timeline({
               scrollTrigger: { trigger: curtain1Ref.current, start: "top top", end: "+=150%", scrub: true, pin: true }
             });
             curtain1Tl.to(curtainMedia1Ref.current, { width: "100vw", height: "100vh", borderRadius: "0px", ease: "none" })
                       .to(curtainText1Ref.current, { opacity: 1, scale: 1.2, y: 0, duration: 0.5 }, "-=0.3")
                       .to(curtainText1Ref.current, { opacity: 0, scale: 1.5, y: -100, duration: 0.5 }, "+=0.2");

             // The Forge Timeline (ULTRA REDUCED TO 90%)
             const forgeTl = gsap.timeline({
               scrollTrigger: {
                 trigger: forgeSectionRef.current,
                 start: "top top",
                 end: "+=90%",
                 scrub: true,
                 pin: true
               }
             });

             FORGE_STACK.forEach((item, i) => {
               const el = forgeItemsRef.current[i];
               const icon = el.querySelector('.forge-icon');
               const text = el.querySelector('.forge-text');
               
               forgeTl.to(el, { opacity: 1, pointerEvents: 'auto', duration: 1 })
                      .from(icon, { z: -800, rotateY: 45, filter: 'blur(15px)', duration: 1 }, "-=1")
                      .from(text, { y: 50, opacity: 0, duration: 1 }, "-=0.5")
                      .to(el, { opacity: 0, pointerEvents: 'none', y: -50, filter: 'blur(5px)', duration: 1, delay: 0.1 });
             });

             // Curtain 2 (RESTORED)
             const curtain2Tl = gsap.timeline({
               scrollTrigger: { trigger: curtain2Ref.current, start: "top top", end: "+=150%", scrub: true, pin: true }
             });
             curtain2Tl.to(curtainMedia2Ref.current, { width: "100vw", height: "100vh", borderRadius: "0px", ease: "none" })
                       .to(curtainText2Ref.current, { opacity: 1, scale: 1.2, y: 0, duration: 0.5 }, "-=0.3")
                       .to(curtainText2Ref.current, { opacity: 0, scale: 1.5, y: -100, duration: 0.5 }, "+=0.2");

             // Horizontal Projects
             gsap.to(horizontalWrapperRef.current, {
               x: () => -(horizontalWrapperRef.current.scrollWidth - window.innerWidth),
               ease: "none",
               scrollTrigger: {
                 trigger: horizontalSectionRef.current,
                 start: "top top",
                 end: () => `+=${horizontalWrapperRef.current.scrollWidth}`,
                 scrub: 1,
                 pin: true,
                 invalidateOnRefresh: true
               }
             });

             // Story Parallax
             const storyTl = gsap.timeline({
               scrollTrigger: { trigger: storySectionRef.current, start: "top top", end: "bottom top", scrub: true }
             });
             storyTl.to(storyTextRef.current, { xPercent: -20, ease: "none" }, 0)
                    .from(storyImgRef.current, { scale: 1.4, yPercent: 20, ease: "none" }, 0);

             // Deck Section
             const deckTl = gsap.timeline({
               scrollTrigger: {
                 trigger: deckSectionRef.current,
                 start: "top top",
                 end: "+=150%",
                 pin: true,
                 scrub: true
               }
             });
             const cards = gsap.utils.toArray('.deck-card');
             cards.forEach((card, i) => {
               deckTl.to(card, {
                 rotationZ: (i - 1) * 15,
                 xPercent: (i - 1) * 10,
                 y: Math.abs(i - 1) * 30,
                 scale: 1.1,
                 duration: 1
               }, 0);
             });

             // List items
             const listItems = gsap.utils.toArray('.list-item');
             if (listItems.length) {
               gsap.from(listItems, {
                 x: -50, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out",
                 scrollTrigger: { trigger: ".list-section", start: "top 90%" }
               });
             }

             // Footer
             gsap.from('.footer-content', {
               y: 100, opacity: 0, duration: 2, ease: "expo.out", 
               scrollTrigger: { trigger: ".footer-section", start: "top 95%" }
             });

             requestAnimationFrame(() => ScrollTrigger.refresh());
           }, containerRef);
        }, 200);
      }
    }, 20);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      clearInterval(interval);
      lenis.destroy();
      gsap.ticker.remove(raf);
      if (ctx) ctx.revert();
    };
  }, []);

  const handleCursorHover = (type) => {
    if (cursorRef.current) {
      cursorRef.current.className = `custom-cursor ${type || ''}`;
      if (type) playHover();
    }
  };

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="loader"
            exit={{ opacity: 0, filter: 'blur(30px)', transition: { duration: 1.2, ease: "easeInOut" } }}
            className="preloader"
          >
            <div style={{ overflow: 'hidden' }}>
                <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: FRAMER_EASE_OUT_STRONG }}
                style={{ fontSize: '0.9rem', letterSpacing: '10px', opacity: 0.6, marginBottom: '1.5rem' }}
              >
                WARPOD STUDIO INITIALIZING
              </motion.div>
            </div>
            <div style={{ fontSize: '12vw', fontWeight: 900, fontFamily: 'ClashDisplay', letterSpacing: '-0.05em' }}>
              {progress}%
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={containerRef} style={{ opacity: loading ? 0 : 1, transition: 'opacity 2s ease', visibility: loading ? 'hidden' : 'visible' }}>
        <div className="canvas-container">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }} gl={{ powerPreference: "high-performance", antialias: true, alpha: false }}>
            <Scene />
          </Canvas>
        </div>
        
        <main className="content">
          {/* HERO SECTION */}
          <section className="section" style={{ minHeight: '100vh', padding: '10vw' }}>
            <h1 className="hero-title">
              <SplitText>WARPOD</SplitText><br/>
              <SplitText>STUDIO</SplitText>
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={!loading ? { opacity: 0.7, y: 0 } : {}}
              transition={{ duration: 1.5, delay: 1.2, ease: FRAMER_EASE_OUT }}
              className="hero-subtitle"
            >
              Architecting High-End Digital Interfaces.
            </motion.p>
          </section>

          {/* MARQUEE */}
          <section className="marquee-container" onMouseEnter={() => handleCursorHover('glass-active')} onMouseLeave={() => handleCursorHover('')}>
            <div className="marquee-content">
              <span className="marquee-text">UI DESIGN</span>
              <span className="marquee-text marquee-outline">UX STRATEGY</span>
              <span className="marquee-text">BRAND IDENTITY</span>
              <span className="marquee-text marquee-outline">MOTION SYSTEMS</span>
              <span className="marquee-text">DIGITAL PRODUCTS</span>
              <span className="marquee-text marquee-outline">WARPOD STUDIO</span>
            </div>
          </section>

          {/* CURTAIN 1 */}
          <section className="curtain-section" ref={curtain1Ref}>
            <div className="curtain-sticky">
              <div className="curtain-media" ref={curtainMedia1Ref} onMouseEnter={() => handleCursorHover('active')} onMouseLeave={() => handleCursorHover('')}>
                <video src="/assets/videos/12061631_3840_2160_24fps.mp4" autoPlay loop muted playsInline preload="auto" />
              </div>
              <h2 className="curtain-text" ref={curtainText1Ref}>
                CREATIVE<br/>VISION.
              </h2>
            </div>
          </section>

          {/* SCRUB TEXT */}
          <section className="scrub-section">
            <p className="scrub-text">
              <SplitWords text="WE ELEVATE DIGITAL STANDARDS THROUGH PURPOSEFUL DESIGN. OUR STUDIO CRAFTS UNIQUE VISUAL NARRATIVES AND SEAMLESS INTERFACES THAT CAPTIVATE EMOTIONS." />
            </p>
          </section>

          {/* THE ARCHITECTURAL FORGE */}
          <section className="forge-section" ref={forgeSectionRef}>
            <div className="forge-sticky">
              <div className="forge-title">THE ARCHITECTURAL FORGE</div>
              {FORGE_STACK.map((item, i) => (
                <div key={i} className="forge-item" ref={el => forgeItemsRef.current[i] = el}>
                  <div className="forge-icon">
                    <img src={`/assets/icons/${item.icon}`} alt={item.name} style={{ width: '100%' }} />
                  </div>
                  <div className="forge-text">
                    <h4>{item.name}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CURTAIN 2 */}
          <section className="curtain-section" ref={curtain2Ref}>
            <div className="curtain-sticky">
              <div className="curtain-media" ref={curtainMedia2Ref} onMouseEnter={() => handleCursorHover('active')} onMouseLeave={() => handleCursorHover('')}>
                <video src="/assets/videos/15616403_3840_2160_60fps.mp4" autoPlay loop muted playsInline preload="auto" />
              </div>
              <h2 className="curtain-text" ref={curtainText2Ref}>
                DIGITAL<br/>MASTERY.
              </h2>
            </div>
          </section>

          {/* HORIZONTAL SHOWCASE */}
          <section className="horizontal-scroll-container" ref={horizontalSectionRef}>
            <div className="horizontal-wrapper" ref={horizontalWrapperRef}>
              <div className="project-panel">
                <div className="project-content">
                  <div className="project-image-box">
                    <img src="/assets/images/premium_bg_4.jpg" alt="P1" />
                  </div>
                  <div className="project-info">
                    <h3>Luxury<br/>Systems.</h3>
                    <p>High-end interface design for world-class fashion conglomerates, focusing on micro-interactions and performance.</p>
                  </div>
                </div>
              </div>
              <div className="project-panel" style={{ background: '#050505' }}>
                <div className="project-content">
                  <div className="project-info">
                    <h3 style={{ color: '#00d2ff' }}>Interactive<br/>Retail.</h3>
                    <p>Redefining the digital shopping experience through seamless UX and immersive brand storytelling.</p>
                  </div>
                  <div className="project-image-box">
                    <img src="/assets/images/premium_bg_1.jpg" alt="P2" />
                  </div>
                </div>
              </div>
              <div className="project-panel">
                <div className="project-content">
                  <div className="project-image-box">
                    <video src="/assets/videos/15616403_3840_2160_60fps.mp4" autoPlay loop muted playsInline preload="auto" />
                  </div>
                  <div className="project-info">
                    <h3>Motion<br/>Identity.</h3>
                    <p>Bringing brands to life through advanced motion systems and interactive visual components.</p>
                  </div>
                </div>
              </div>
              <div className="project-panel" style={{ background: '#0a0a0a' }}>
                <div className="project-content">
                  <div className="project-info">
                    <h3 style={{ color: '#fff' }}>Digital<br/>Core.</h3>
                    <p>Scalable design systems that empower teams to build consistent and beautiful products at speed.</p>
                  </div>
                  <div className="project-image-box">
                    <img src="/assets/images/bg1.jpg" alt="P4" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STORY PARALLAX */}
          <section className="story-parallax-section" ref={storySectionRef}>
            <div className="story-layer" style={{ zIndex: 1 }}>
              <div className="story-bg-text" ref={storyTextRef}>CRAFTING DREAMS</div>
            </div>
            <div className="story-layer" style={{ zIndex: 2 }}>
              <div className="story-floating-img" ref={storyImgRef}>
                <img src="/assets/images/premium_bg_3.jpg" alt="Vision" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="story-layer" style={{ zIndex: 3 }}>
               <h2 style={{ fontSize: '8vw', fontWeight: 900, textAlign: 'center', marginTop: '40vh' }}>The Future is Fluid.</h2>
            </div>
          </section>

          {/* DECK SECTION */}
          <section className="deck-section" ref={deckSectionRef}>
             <div className="deck-container">
               <div className="deck-card" style={{ zIndex: 1 }}>
                  <img src="/assets/images/premium_bg_1.jpg" alt="UI Case A" />
               </div>
               <div className="deck-card" style={{ zIndex: 2 }}>
                  <img src="/assets/images/premium_bg_2.jpg" alt="UI Case B" />
               </div>
               <div className="deck-card" style={{ zIndex: 3 }}>
                  <img src="/assets/images/bg1.jpg" alt="UI Case C" />
               </div>
             </div>
          </section>

          {/* PHILOSOPHY SECTION */}
          <section className="section" style={{ minHeight: '120vh', padding: '10vw' }}>
            <div className="glass-card" onMouseEnter={() => handleCursorHover('glass-active')} onMouseLeave={() => handleCursorHover('')}>
              <h2>Design Excellence.</h2>
              <h3>Visual Precision</h3>
              <p className="philosophy-text">Every pixel is placed with intention, balancing beauty and function in every interface we build.</p>
            </div>
          </section>

          {/* STATS SECTION */}
          <section className="section stats-section">
            <div className="stats-grid">
              <div className="rv">
                <h4 className="rv-label">SATISFACTION</h4>
                <div className="rv-value accent">100%</div>
              </div>
              <div className="rv">
                <h4 className="rv-label">PRECISION</h4>
                <div className="rv-value tiny">PIXEL PERFECT</div>
              </div>
              <div className="rv">
                <h4 className="rv-label">COMPONENTS</h4>
                <div className="rv-value">5000+</div>
              </div>
            </div>
          </section>

          {/* KINETIC CORE (REALLY 3D) - FINAL INTERACTIVE SECTION */}
          <section className="kinetic-section" style={{ minHeight: '100vh', background: '#000', paddingBottom: '0' }}>
            <div style={{ position: 'relative', top: '10vh', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
               <h2 style={{ fontSize: '8vw', fontWeight: 900, opacity: 0.3 }}>KINETIC CORE</h2>
            </div>
            <div className="local-canvas-wrapper" style={{ height: '80vh' }}>
              <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
                <Suspense fallback={null}>
                  <KineticScene />
                </Suspense>
              </Canvas>
            </div>
          </section>

          {/* FOOTER */}
          <section className="section footer-section" style={{ padding: '5vw 10vw', textAlign: 'center', minHeight: '60vh', justifyContent: 'center', background: '#000', marginTop: '-2px' }}>
            <Magnetic>
              <div className="footer-content magnetic" style={{ cursor: 'none' }}>
                <h2 style={{ fontSize: '12vw', fontWeight: 900, marginBottom: '2rem', lineHeight: 0.75, letterSpacing: '-0.06em' }}>LET&apos;S<br/>BUILD.</h2>
                <p style={{ opacity: 0.4, letterSpacing: '8px', textTransform: 'uppercase', fontSize: '1rem' }}>WARPOD STUDIO &copy; 2026.</p>
              </div>
            </Magnetic>
          </section>
        </main>
      </div>
    </>
  );
}
