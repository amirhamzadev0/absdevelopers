"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  HERO_FRAME_FILES,
  HERO_FRAME_BASE_PATH,
  TOTAL_HERO_FRAMES,
  HERO_STAGES,
  type HeroStage,
} from "@/config/heroFrames";

interface PearlCapitalHeroProps {
  initialTitle?: string;
}

export function PearlCapitalHero({ initialTitle }: PearlCapitalHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation & Frame tracking
  const [progress, setProgress] = useState(0); // 0 to 1
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState(0);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // References for high-performance rendering loop without re-renders
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef(0);
  const currentRenderedFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const playTimerRef = useRef<number | null>(null);

  // 1. Progressive Image Preloading System
  useEffect(() => {
    let isCancelled = false;
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_HERO_FRAMES).fill(null);
    imagesRef.current = images;

    let loadedCount = 0;

    const updateLoadProgress = () => {
      if (isCancelled) return;
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_HERO_FRAMES) * 100);
      setLoadedPercent(pct);

      // Once at least 15% (key frames) are loaded, mark as ready so user isn't blocked
      if (loadedCount >= 15 && !isReady) {
        setIsReady(true);
      }
    };

    // Helper to load a single frame
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (images[index]) {
          resolve(images[index]!);
          return;
        }
        const img = new Image();
        img.src = `${HERO_FRAME_BASE_PATH}/${HERO_FRAME_FILES[index]}`;

        img.onload = () => {
          if (!isCancelled) {
            images[index] = img;
            updateLoadProgress();
            // If this is frame 0, draw it immediately to prevent any empty canvas
            if (index === 0 && canvasRef.current) {
              drawFrame(0);
            }
          }
          resolve(img);
        };

        img.onerror = () => {
          // Fallback to hero section directory with space if path variation occurs
          img.src = `/assets/hero section/${HERO_FRAME_FILES[index]}`;
          img.onload = () => {
            if (!isCancelled) {
              images[index] = img;
              updateLoadProgress();
              if (index === 0 && canvasRef.current) {
                drawFrame(0);
              }
            }
            resolve(img);
          };
          img.onerror = () => {
            updateLoadProgress();
            resolve(img);
          };
        };
      });
    };

    // Phase 1: Load frame 0 immediately
    loadFrame(0).then(() => {
      if (isCancelled) return;

      // Phase 2: Load keyframes evenly spread across the entire sequence (every 4th frame)
      const keyframeIndices: number[] = [];
      for (let i = 0; i < TOTAL_HERO_FRAMES; i += 4) {
        if (i !== 0) keyframeIndices.push(i);
      }

      // Load keyframes with controlled concurrency
      const loadBatch = async (indices: number[], batchSize = 6) => {
        for (let i = 0; i < indices.length; i += batchSize) {
          if (isCancelled) break;
          const chunk = indices.slice(i, i + batchSize);
          await Promise.all(chunk.map((idx) => loadFrame(idx)));
        }
      };

      loadBatch(keyframeIndices, 8).then(() => {
        if (isCancelled) return;
        setIsReady(true);

        // Phase 3: Load remaining frames in background
        const remainingIndices: number[] = [];
        for (let i = 0; i < TOTAL_HERO_FRAMES; i++) {
          if (!images[i]) remainingIndices.push(i);
        }
        loadBatch(remainingIndices, 6);
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. High-Performance Canvas Draw Function
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Find requested frame or the closest loaded frame
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Search backwards and forwards for closest loaded frame
      for (let offset = 1; offset < 20; offset++) {
        const prev = imagesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || 800;
    const imgHeight = img.naturalHeight || 450;

    // Scale mode: Cover with subtle cinematic alignment
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    // Center image on canvas with responsive compensation
    const isMobile = canvasWidth < 768;
    const offsetX = (canvasWidth - drawWidth) * (isMobile ? 0.5 : 0.62); // slightly nudge right on desktop to leave room for text
    const offsetY = (canvasHeight - drawHeight) * 0.5;

    // Fill canvas background
    ctx.fillStyle = "#0a0d0c";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the building frame with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Apply dark vignette gradients directly onto canvas for optimal performance
    // Left gradient for typography readability
    const leftGrad = ctx.createLinearGradient(0, 0, canvasWidth * (isMobile ? 0.9 : 0.55), 0);
    leftGrad.addColorStop(0, "rgba(10, 13, 12, 0.92)");
    leftGrad.addColorStop(0.4, "rgba(10, 13, 12, 0.65)");
    leftGrad.addColorStop(1, "rgba(10, 13, 12, 0.0)");
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Top subtle gradient
    const topGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.25);
    topGrad.addColorStop(0, "rgba(10, 13, 12, 0.85)");
    topGrad.addColorStop(1, "rgba(10, 13, 12, 0.0)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.25);

    // Bottom subtle transition gradient
    const bottomGrad = ctx.createLinearGradient(0, canvasHeight * 0.72, 0, canvasHeight);
    bottomGrad.addColorStop(0, "rgba(10, 13, 12, 0.0)");
    bottomGrad.addColorStop(1, "rgba(10, 13, 12, 0.95)");
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, canvasHeight * 0.72, canvasWidth, canvasHeight * 0.28);
  }, []);

  // 3. Responsive Canvas Resizing with Retina Support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Re-draw current frame
        drawFrame(Math.round(currentRenderedFrameRef.current));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // 4. Smooth Animation Loop with LERP Interpolation (Apple-style buttery feel)
  useEffect(() => {
    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const current = currentRenderedFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      // Smooth interpolation factor (0.18 gives responsive yet silky motion)
      if (Math.abs(diff) > 0.02) {
        const next = current + diff * 0.18;
        currentRenderedFrameRef.current = next;
        const roundedFrame = Math.min(
          TOTAL_HERO_FRAMES - 1,
          Math.max(0, Math.round(next))
        );
        drawFrame(roundedFrame);
        setCurrentFrameDisplay(roundedFrame);
      } else if (current !== target) {
        currentRenderedFrameRef.current = target;
        drawFrame(target);
        setCurrentFrameDisplay(target);
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame]);

  // 5. Scroll Handler: Bind scroll position to frame sequence
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalScrollable = rect.height - windowH;

    if (totalScrollable <= 0) return;

    // Calculate progress fraction [0.0, 1.0]
    const scrolledDistance = -rect.top;
    const rawRatio = scrolledDistance / totalScrollable;
    const clampedProgress = Math.max(0, Math.min(1, rawRatio));

    setProgress(clampedProgress);

    if (clampedProgress > 0.02 && !hasScrolled) {
      setHasScrolled(true);
    }

    // Stop auto-play if user manually scrolls
    if (isPlayingRef.current) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    // Target frame based on scroll percentage
    const frame = Math.min(
      TOTAL_HERO_FRAMES - 1,
      Math.max(0, Math.round(clampedProgress * (TOTAL_HERO_FRAMES - 1)))
    );
    targetFrameRef.current = frame;
  }, [hasScrolled]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 6. Auto-Tour Play/Pause Feature
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;

      // If at end, loop back to start
      if (targetFrameRef.current >= TOTAL_HERO_FRAMES - 5) {
        targetFrameRef.current = 0;
        currentRenderedFrameRef.current = 0;
      }

      playTimerRef.current = window.setInterval(() => {
        if (!containerRef.current) return;
        const nextFrame = targetFrameRef.current + 1;

        if (nextFrame >= TOTAL_HERO_FRAMES) {
          setIsPlaying(false);
          isPlayingRef.current = false;
          if (playTimerRef.current) clearInterval(playTimerRef.current);
          return;
        }

        targetFrameRef.current = nextFrame;

        // Also smoothly scroll page so scrollbar stays synchronized
        const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
        const targetScrollTop =
          containerRef.current.offsetTop + (nextFrame / (TOTAL_HERO_FRAMES - 1)) * totalHeight;

        window.scrollTo({
          top: targetScrollTop,
          behavior: "auto",
        });
      }, 35); // ~28 fps smooth auto-play
    }
  };

  useEffect(() => {
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, []);

  // 7. Milestone Quick Jump Navigation
  const scrollToMilestone = (stageStart: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollTop = containerRef.current.offsetTop + stageStart * totalHeight;

    window.scrollTo({
      top: targetScrollTop + 10,
      behavior: "smooth",
    });
  };

  // Determine active stage based on progress
  const activeStageIndex = useMemo(() => {
    for (let i = 0; i < HERO_STAGES.length; i++) {
      if (progress >= HERO_STAGES[i].start && progress <= HERO_STAGES[i].end) {
        return i;
      }
    }
    return HERO_STAGES.length - 1;
  }, [progress]);

  // Calculate smooth cross-fade styles for each stage
  const getStageOpacityAndTransform = (stage: HeroStage) => {
    const { start, end } = stage;
    const mid = (start + end) / 2;
    const halfWidth = (end - start) / 2;

    // Normalizing distance from stage midpoint
    const dist = Math.abs(progress - mid);
    const normalizedDist = dist / halfWidth;

    // Smooth bell-curve opacity
    let opacity = 1 - Math.pow(normalizedDist, 1.8);
    opacity = Math.max(0, Math.min(1, opacity));

    // Vertical parallax float
    const translateY = (progress - mid) * 70; // moves up smoothly as you scroll forward

    return {
      opacity,
      transform: `translate3d(0, ${translateY}px, 0)`,
      pointerEvents: (opacity > 0.4 ? "auto" : "none") as "auto" | "none",
      visibility: (opacity > 0.01 ? "visible" : "hidden") as "visible" | "hidden",
    };
  };

  return (
    <section
      ref={containerRef}
      className="pearl-hero"
      aria-label="Pearl Capital Interactive Building Development Showcase"
    >
      {/* Pinned Sticky Stage */}
      <div className="pearl-hero__sticky">
        {/* Ambient Luxury Lighting & Glow */}
        <div className="pearl-hero__glow pearl-hero__glow--top" />
        <div className="pearl-hero__glow pearl-hero__glow--accent" />

        {/* Apple-style Interactive Canvas */}
        <canvas
          ref={canvasRef}
          className="pearl-hero__canvas"
          role="img"
          aria-label="Pearl Capital Islamabad 3D Architectural Progression"
        />

        {/* Minimalist Architectural HUD Details */}
        <div className="pearl-hero__hud-top">
          <div className="pearl-hud-item">
            <span className="pearl-hud-dot" />
            <span className="pearl-hud-label">ABS DEVELOPERS</span>
            <span className="pearl-hud-sep">/</span>
            <span className="pearl-hud-value">FLAGSHIP PROJECT</span>
          </div>

          <div className="pearl-hud-item pearl-hud-item--coords">
            <span className="pearl-hud-label">ISLAMABAD</span>
            <span className="pearl-hud-coords">33.6844° N · 73.0479° E</span>
          </div>

          <div className="pearl-hud-item pearl-hud-item--frame">
            <span className="pearl-hud-label">PROGRESSION</span>
            <span className="pearl-hud-badge">
              {String(currentFrameDisplay + 1).padStart(3, "0")} / {TOTAL_HERO_FRAMES}
            </span>
          </div>
        </div>

        {/* Dynamic Storytelling Typography Layer (Apple Style Scroll Stages) */}
        <div className="pearl-hero__stage-wrapper">
          {HERO_STAGES.map((stage, idx) => {
            const style = getStageOpacityAndTransform(stage);

            return (
              <div
                key={stage.id}
                className={`pearl-hero__stage-card ${idx === activeStageIndex ? "is-active" : ""}`}
                style={style}
              >
                {/* Eyebrow Badge */}
                <div className="pearl-eyebrow">
                  <span className="pearl-eyebrow__indicator" />
                  <span className="pearl-eyebrow__text">{stage.eyebrow}</span>
                </div>

                {/* Main Heading */}
                <h1 className="pearl-stage-title">
                  {stage.title} <span className="pearl-stage-title__accent">{stage.titleAccent}</span>
                </h1>

                {/* Subtitle */}
                <p className="pearl-stage-subtitle">{stage.subtitle}</p>

                {/* Narrative Description */}
                <p className="pearl-stage-desc">{stage.description}</p>

                {/* Highlight Pills */}
                <div className="pearl-stage-pills">
                  {stage.highlights.map((h, i) => (
                    <span key={i} className="pearl-pill">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Live Architectural Metrics */}
                <div className="pearl-stage-stats">
                  {stage.stats.map((s, i) => (
                    <div key={i} className="pearl-stat-card">
                      <span className="pearl-stat-val">{s.value}</span>
                      <span className="pearl-stat-lbl">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive CTAs */}
                <div className="pearl-stage-actions">
                  {stage.primaryCta && (
                    <a
                      href={stage.primaryCta.href}
                      className="pearl-btn pearl-btn--gold"
                      onClick={(e) => {
                        if (stage.primaryCta?.href.startsWith("#")) {
                          e.preventDefault();
                          const el = document.querySelector(stage.primaryCta.href);
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <span>{stage.primaryCta.label}</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  )}

                  {stage.secondaryCta && (
                    <a
                      href={stage.secondaryCta.href}
                      className="pearl-btn pearl-btn--glass"
                      onClick={(e) => {
                        if (stage.secondaryCta?.href.startsWith("#")) {
                          e.preventDefault();
                          const el = document.querySelector(stage.secondaryCta.href);
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <span>{stage.secondaryCta.label}</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Vertical Track (Right Side Navigation) */}
        <aside className="pearl-hero__milestones" aria-label="Development Milestone Navigation">
          <div className="pearl-milestone-track">
            {HERO_STAGES.map((stg, i) => {
              const isActive = i === activeStageIndex;
              return (
                <button
                  key={stg.id}
                  type="button"
                  className={`pearl-milestone-btn ${isActive ? "is-active" : ""}`}
                  onClick={() => scrollToMilestone(stg.start)}
                  aria-label={`Jump to stage ${stg.stepNumber}: ${stg.label}`}
                  title={`${stg.stepNumber} · ${stg.label}`}
                >
                  <span className="pearl-milestone-num">{stg.stepNumber}</span>
                  <span className="pearl-milestone-label">{stg.label}</span>
                  <span className="pearl-milestone-pip" />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Bottom Interactive HUD Bar & Timeline Scrubber */}
        <div className="pearl-hero__hud-bottom">
          {/* Left: Auto-Tour Controller */}
          <div className="pearl-hud-control">
            <button
              type="button"
              className={`pearl-play-btn ${isPlaying ? "is-playing" : ""}`}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause 3D Tour" : "Play 3D Progression Tour"}
            >
              {isPlaying ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>PAUSE TOUR</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>AUTO TOUR</span>
                </>
              )}
            </button>

            <span className="pearl-hud-scrub-text">
              {Math.round(progress * 100)}% DEVELOPED
            </span>
          </div>

          {/* Center: Glowing Progress Timeline Scrubber */}
          <div className="pearl-scrubber">
            <div className="pearl-scrubber__track">
              <div
                className="pearl-scrubber__fill"
                style={{ width: `${Math.max(3, progress * 100)}%` }}
              />
              <div
                className="pearl-scrubber__thumb"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* Right: Scroll Prompt / Preloader Status */}
          <div className="pearl-hud-status">
            {loadedPercent < 99 && !hasScrolled ? (
              <div className="pearl-preload-badge">
                <span className="pearl-preload-spinner" />
                <span>CACHING 3D ASSETS {loadedPercent}%</span>
              </div>
            ) : (
              <button
                type="button"
                className="pearl-scroll-indicator"
                onClick={() => scrollToMilestone(0.26)}
                aria-label="Scroll to view development"
              >
                <span>SCROLL TO EXPLORE</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pearl-bounce-icon">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
