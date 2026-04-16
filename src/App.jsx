import React, { lazy, useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const FRAMER_EASE_OUT = [0.22, 1, 0.36, 1];
const FRAMER_EASE_OUT_STRONG = [0.16, 1, 0.3, 1];
const BackgroundCanvas = lazy(() => import('./BackgroundCanvas'));
const KineticCanvas = lazy(() => import('./KineticCanvas'));

const getPerformanceProfile = () => {
  if (typeof window === 'undefined') {
    return {
      isCoarsePointer: false,
      shouldConserve: false,
      enableCursor: true,
      enableLenis: true,
      allowHoverAudio: true,
      allowAmbientAudio: true,
      videoPreload: 'auto',
      canvasDpr: [1, 2],
      showBackgroundCanvas: true,
      backgroundSceneQuality: 'full',
      kineticSceneQuality: 'full',
      kineticPosterOnly: false
    };
  }

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isCompactViewport = window.matchMedia('(max-width: 900px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection?.saveData);
  const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
  const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 6;
  const shouldConserve =
    prefersReducedMotion ||
    saveData ||
    isCoarsePointer ||
    isCompactViewport ||
    lowMemory ||
    lowCpu;

  return {
    isCoarsePointer,
    shouldConserve,
    enableCursor: !isCoarsePointer,
    enableLenis: !isCoarsePointer && !prefersReducedMotion,
    allowHoverAudio: !isCoarsePointer && !saveData,
    allowAmbientAudio: true,
    videoPreload: shouldConserve ? 'metadata' : 'auto',
    canvasDpr: shouldConserve ? [1, 1.2] : isCompactViewport ? [1, 1.5] : [1, 2],
    showBackgroundCanvas: !saveData && !prefersReducedMotion,
    backgroundSceneQuality: shouldConserve ? 'reduced' : 'full',
    kineticSceneQuality: shouldConserve ? 'reduced' : 'full',
    kineticPosterOnly: isCoarsePointer && shouldConserve
  };
};

class CanvasBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('3D canvas failed to render', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

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

const Magnetic = ({ children, enabled = true }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
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
  }, [enabled]);
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
  const kineticSectionRef = useRef();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [perfProfile, setPerfProfile] = useState(() => getPerformanceProfile());
  const [shouldMountKineticCanvas, setShouldMountKineticCanvas] = useState(false);
  const [shouldLoadForgeMedia, setShouldLoadForgeMedia] = useState(
    () => !getPerformanceProfile().shouldConserve
  );
  const [shouldLoadDigitalMasteryVideo, setShouldLoadDigitalMasteryVideo] = useState(
    () => !getPerformanceProfile().shouldConserve
  );
  const cursorRef = useRef(null);
  
  const ambientSound = useRef(null);
  const hoverSound = useRef(null);

  const {
    shouldConserve,
    enableCursor,
    enableLenis,
    allowHoverAudio,
    allowAmbientAudio,
    videoPreload,
    canvasDpr,
    showBackgroundCanvas,
    backgroundSceneQuality,
    kineticSceneQuality,
    kineticPosterOnly
  } = perfProfile;

  useEffect(() => {
    const updateProfile = () => setPerfProfile(getPerformanceProfile());
    updateProfile();
    window.addEventListener('resize', updateProfile, { passive: true });
    window.addEventListener('orientationchange', updateProfile, { passive: true });

    return () => {
      window.removeEventListener('resize', updateProfile);
      window.removeEventListener('orientationchange', updateProfile);
    };
  }, []);

  useEffect(() => {
    const target = kineticSectionRef.current;
    if (!target || kineticPosterOnly) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMountKineticCanvas(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [kineticPosterOnly]);

  useEffect(() => {
    if (!perfProfile.shouldConserve) {
      setShouldLoadForgeMedia(true);
      return;
    }

    if (shouldLoadForgeMedia) return;

    const target = forgeSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadForgeMedia(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [perfProfile.shouldConserve, shouldLoadForgeMedia]);

  useEffect(() => {
    if (!perfProfile.shouldConserve) {
      setShouldLoadDigitalMasteryVideo(true);
      return;
    }

    if (shouldLoadDigitalMasteryVideo) return;

    const target = curtain2Ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadDigitalMasteryVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1400px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [perfProfile.shouldConserve, shouldLoadDigitalMasteryVideo]);

  useEffect(() => {
    ambientSound.current = null;
    hoverSound.current = null;
  }, []);

  const playHover = () => {
    if (!allowHoverAudio) return;
    if (!hoverSound.current) {
      hoverSound.current = new Audio('/assets/audio/hover.mp3');
      hoverSound.current.volume = 0.05;
    }
    if (hoverSound.current) {
      hoverSound.current.currentTime = 0;
      hoverSound.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const playAmbient = () => {
      if (!allowAmbientAudio) return;
      if (!ambientSound.current) {
        ambientSound.current = new Audio('/assets/audio/bg-ambient.mp3');
        ambientSound.current.volume = 0.4;
        ambientSound.current.loop = true;
      }
      if (ambientSound.current && ambientSound.current.paused) {
        ambientSound.current.play().then(() => {
          window.removeEventListener('pointerdown', playAmbient);
          window.removeEventListener('touchstart', playAmbient);
          window.removeEventListener('keydown', playAmbient);
          window.removeEventListener('wheel', playAmbient);
          window.removeEventListener('mousedown', playAmbient);
        }).catch(() => {});
      }
    };

    if (allowAmbientAudio) {
      window.addEventListener('pointerdown', playAmbient, { passive: true });
      window.addEventListener('touchstart', playAmbient, { passive: true });
      window.addEventListener('keydown', playAmbient, { passive: true });
      window.addEventListener('wheel', playAmbient, { passive: true });
      window.addEventListener('mousedown', playAmbient, { passive: true });
    }

    return () => {
      window.removeEventListener('pointerdown', playAmbient);
      window.removeEventListener('touchstart', playAmbient);
      window.removeEventListener('keydown', playAmbient);
      window.removeEventListener('wheel', playAmbient);
      window.removeEventListener('mousedown', playAmbient);
    };
  }, [allowAmbientAudio]);

  useEffect(() => {
    const lenis = enableLenis
      ? new Lenis({
          duration: 1.35,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
        })
      : null;
    const raf = (time) => lenis?.raf(time * 1000);
    lenis?.on('scroll', ScrollTrigger.update);
    if (lenis) {
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    let moveCursor = null;
    let xTo = null;
    let yTo = null;
    if (enableCursor && cursorRef.current) {
      xTo = gsap.quickTo(cursorRef.current, "x", {duration: 0.15, ease: "power2.out"});
      yTo = gsap.quickTo(cursorRef.current, "y", {duration: 0.15, ease: "power2.out"});
      moveCursor = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener('mousemove', moveCursor, { passive: true });
    }

    let ctx;
    const deferredContexts = [];
    const deferredHandles = [];

    const scheduleDeferredSection = (callback, timeout = 600) => {
      const run = () => {
        deferredContexts.push(
          gsap.context(() => {
            callback();
          }, containerRef)
        );
        refreshTimeouts.push(window.setTimeout(() => ScrollTrigger.refresh(), 80));
      };

      if ('requestIdleCallback' in window) {
        const handle = window.requestIdleCallback(run, { timeout });
        deferredHandles.push({ type: 'idle', handle });
      } else {
        const handle = window.setTimeout(run, Math.min(timeout, 320));
        deferredHandles.push({ type: 'timeout', handle });
      }
    };

    const getCurtainMaskSeed = () => {
      const isCompact = window.matchMedia('(max-width: 700px)').matches;
      const width = isCompact
        ? Math.min(Math.max(window.innerWidth * 0.52, 150), 260)
        : Math.min(Math.max(window.innerWidth * 0.18, 180), 360);
      const height = isCompact
        ? Math.min(Math.max(window.innerHeight * 0.24, 150), 300)
        : Math.min(Math.max(window.innerHeight * 0.28, 180), 420);

      return `ellipse(${Math.round(width / 2)}px ${Math.round(height / 2)}px at 50% 50%)`;
    };

    const setupCurtainReveal = (trigger, media, text) => {
      const fullMask = "ellipse(100vw 100vh at 50% 50%)";
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "+=220%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(
        media,
        {
          clipPath: () => getCurtainMaskSeed(),
          webkitClipPath: () => getCurtainMaskSeed()
        },
        {
          clipPath: fullMask,
          webkitClipPath: fullMask,
          ease: "none",
          duration: 1.05
        }
      )
        .to(text, { opacity: 1, scale: 1.2, y: 0, duration: 0.45 }, "-=0.22")
        .to(text, { opacity: 1, scale: 1.22, y: -8, duration: 0.2 })
        .to(text, { opacity: 0, scale: 1.5, y: -100, duration: 0.45 })
        .to(media, {
          clipPath: () => getCurtainMaskSeed(),
          webkitClipPath: () => getCurtainMaskSeed(),
          ease: "none",
          duration: 0.9
        }, "-=0.04");

      return tl;
    };

    let p = 0;
    const refreshTimeouts = [];
    const interval = setInterval(() => {
      p += shouldConserve ? 5 : 2;
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
             gsap.fromTo(scrubWords,
               { opacity: 0, y: 100, scale: 0.5, filter: 'blur(10px)' },
               {
                 opacity: 1,
                 y: 0,
                 scale: 1,
                 filter: 'blur(0px)',
                 stagger: 0.08,
                 scrollTrigger: {
                   trigger: ".scrub-section",
                   start: "top 78%",
                   end: "bottom center",
                   scrub: 1.2
                 }
               }
             );

             // Curtain 1
             setupCurtainReveal(curtain1Ref.current, curtainMedia1Ref.current, curtainText1Ref.current);

             requestAnimationFrame(() => ScrollTrigger.refresh());
             refreshTimeouts.push(window.setTimeout(() => ScrollTrigger.refresh(), 450));
           }, containerRef);

           scheduleDeferredSection(() => {
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
               if (!el) return;

               const icon = el.querySelector('.forge-icon');
               const text = el.querySelector('.forge-text');

               forgeTl.to(el, { opacity: 1, pointerEvents: 'auto', duration: 1 })
                 .from(icon, { z: -800, rotateY: 45, filter: 'blur(15px)', duration: 1 }, "-=1")
                 .from(text, { y: 50, opacity: 0, duration: 1 }, "-=0.5")
                 .to(el, { opacity: 0, pointerEvents: 'none', y: -50, filter: 'blur(5px)', duration: 1, delay: 0.1 });
             });
           }, 500);

           scheduleDeferredSection(() => {
             setupCurtainReveal(curtain2Ref.current, curtainMedia2Ref.current, curtainText2Ref.current);

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
           }, 850);

           scheduleDeferredSection(() => {
             const storyTl = gsap.timeline({
               scrollTrigger: { trigger: storySectionRef.current, start: "top top", end: "bottom top", scrub: true }
             });

             storyTl.to(storyTextRef.current, { xPercent: -20, ease: "none" }, 0)
               .from(storyImgRef.current, { scale: 1.4, yPercent: 20, ease: "none" }, 0);

             const deckTl = gsap.timeline({
               scrollTrigger: {
                 trigger: deckSectionRef.current,
                 start: "top top",
                 end: "+=150%",
                 pin: true,
                 scrub: true
               }
             });

             gsap.utils.toArray('.deck-card').forEach((card, i) => {
               deckTl.to(card, {
                 rotationZ: (i - 1) * 15,
                 xPercent: (i - 1) * 10,
                 y: Math.abs(i - 1) * 30,
                 scale: 1.1,
                 duration: 1
               }, 0);
             });
           }, 1200);

           scheduleDeferredSection(() => {
             const listItems = gsap.utils.toArray('.list-item');
             if (listItems.length) {
               gsap.from(listItems, {
                 x: -50, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out",
                 scrollTrigger: { trigger: ".list-section", start: "top 90%" }
               });
             }

             gsap.from('.footer-content', {
               y: 100, opacity: 0, duration: 2, ease: "expo.out",
               scrollTrigger: { trigger: ".footer-section", start: "top 95%" }
             });
           }, 1500);
        }, shouldConserve ? 120 : 200);
      }
    }, shouldConserve ? 16 : 20);
    
    return () => {
      if (moveCursor) window.removeEventListener('mousemove', moveCursor);
      clearInterval(interval);
      refreshTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      deferredHandles.forEach(({ type, handle }) => {
        if (type === 'idle' && 'cancelIdleCallback' in window) {
          window.cancelIdleCallback(handle);
          return;
        }

        window.clearTimeout(handle);
      });
      deferredContexts.forEach((context) => context.revert());
      lenis?.destroy();
      if (lenis) gsap.ticker.remove(raf);
      if (ctx) ctx.revert();
    };
  }, [enableCursor, enableLenis, shouldConserve]);

  const handleCursorHover = (type) => {
    if (!enableCursor) return;
    if (cursorRef.current) {
      cursorRef.current.className = `custom-cursor ${type || ''}`;
      if (type) playHover();
    }
  };

  const digitalMasteryVideoSrc = shouldLoadDigitalMasteryVideo
    ? '/assets/videos/digital-mastery-1080p.mp4'
    : undefined;

  return (
    <>
      {enableCursor && <div ref={cursorRef} className="custom-cursor"></div>}
      
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
          {showBackgroundCanvas ? (
            <CanvasBoundary fallback={<div className="canvas-fallback-orb canvas-fallback-orb--strong" />}>
              <Suspense fallback={<div className="canvas-fallback-orb canvas-fallback-orb--loading" />}>
                <BackgroundCanvas dpr={canvasDpr} quality={backgroundSceneQuality} />
              </Suspense>
            </CanvasBoundary>
          ) : (
            <div className="canvas-fallback-orb canvas-fallback-orb--strong" />
          )}
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
                <video src="/assets/videos/creative-vision-1080p.mp4" autoPlay loop muted playsInline preload={videoPreload} />
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
                    <img
                      src={shouldLoadForgeMedia ? `/assets/icons/${item.icon}` : undefined}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%' }}
                    />
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
                <video
                  src={digitalMasteryVideoSrc}
                  autoPlay={shouldLoadDigitalMasteryVideo}
                  loop
                  muted
                  playsInline
                  preload={shouldLoadDigitalMasteryVideo ? videoPreload : 'none'}
                />
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
                    <img src="/assets/images/premium_bg_4.jpg" alt="P1" loading="lazy" decoding="async" />
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
                    <img src="/assets/images/premium_bg_1.jpg" alt="P2" loading="lazy" decoding="async" />
                  </div>
                </div>
              </div>
              <div className="project-panel">
                <div className="project-content">
                  <div className="project-image-box">
                    <video
                      src={digitalMasteryVideoSrc}
                      autoPlay={shouldLoadDigitalMasteryVideo}
                      loop
                      muted
                      playsInline
                      preload={shouldLoadDigitalMasteryVideo ? videoPreload : 'none'}
                    />
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
                    <img src="/assets/images/bg1.jpg" alt="P4" loading="lazy" decoding="async" />
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
                <img src="/assets/images/premium_bg_3.jpg" alt="Vision" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  <img src="/assets/images/premium_bg_1.jpg" alt="UI Case A" loading="lazy" decoding="async" />
               </div>
               <div className="deck-card" style={{ zIndex: 2 }}>
                  <img src="/assets/images/premium_bg_2.jpg" alt="UI Case B" loading="lazy" decoding="async" />
               </div>
               <div className="deck-card" style={{ zIndex: 3 }}>
                  <img src="/assets/images/bg1.jpg" alt="UI Case C" loading="lazy" decoding="async" />
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
          <section ref={kineticSectionRef} className="kinetic-section" style={{ minHeight: '100vh', background: '#000', paddingBottom: '0' }}>
            <div style={{ position: 'relative', top: '10vh', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
               <h2 style={{ fontSize: '8vw', fontWeight: 900, opacity: 0.3 }}>KINETIC CORE</h2>
            </div>
            <div className="local-canvas-wrapper" style={{ height: '80vh' }}>
              {kineticPosterOnly ? (
                <div className="kinetic-poster">
                  <img src="/assets/images/render_3d_1.jpg" alt="Kinetic poster" loading="lazy" decoding="async" />
                </div>
              ) : shouldMountKineticCanvas ? (
                <CanvasBoundary>
                  <Suspense fallback={<div className="kinetic-poster kinetic-poster--loading" />}>
                    <KineticCanvas dpr={canvasDpr} quality={kineticSceneQuality} />
                  </Suspense>
                </CanvasBoundary>
              ) : (
                <div className="kinetic-poster kinetic-poster--loading" />
              )}
            </div>
          </section>

          {/* FOOTER */}
          <section className="section footer-section" style={{ padding: '5vw 10vw', textAlign: 'center', minHeight: '60vh', justifyContent: 'center', background: '#000', marginTop: '-2px' }}>
            <Magnetic enabled={enableCursor}>
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
