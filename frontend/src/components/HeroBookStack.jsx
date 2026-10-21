import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * HeroBookStack
 * Three large, overlapping, notebook-style book covers floating directly on the LitHaven cream background.
 *
 * Composition:
 * - Center Book: Forest Green cover with elegant serif typography "Notes that actually help." (on top)
 * - Left Book: Warm Cream notebook cover tilted behind it on the left with "Think. Learn. Grow."
 * - Right Book: Terracotta Orange notebook cover tilted behind it on the right with "Read. Share. Repeat."
 *
 * Realistic Notebook Features:
 * - Subtle ruled-paper notebook texture & spine cloth binding tape
 * - Realistic layered 3D appearance with tactile spine, page edges, and soft contact shadows
 * - Gentle continuous organic floating animation
 * - Subtle mouse-responsive 3D tilting via smooth LERP
 * - Smooth spreading / fanning effect on hover or tap
 * - Zero external cards, frames, borders, badges, or extra text outside the floating books
 * - Full reduced-motion and mobile responsiveness support
 */

export const HeroBookStack = ({ setCurrentView }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFanned, setIsFanned] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse tilt tracking with smooth interpolation
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Smooth LERP loop for mouse rotation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const animateTilt = () => {
      const factor = 0.085;
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * factor;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * factor;

      setTilt({
        x: Number(currentTilt.current.x.toFixed(3)),
        y: Number(currentTilt.current.y.toFixed(3))
      });

      rafId.current = requestAnimationFrame(animateTilt);
    };

    rafId.current = requestAnimationFrame(animateTilt);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [prefersReducedMotion]);

  const handleMouseMove = useCallback((e) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates between -1 and 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Gentle 3D tilt angles: max ~9deg X tilt, ~13deg Y tilt
    targetTilt.current = {
      x: -normY * 9,
      y: normX * 13
    };
  }, [prefersReducedMotion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    targetTilt.current = { x: 0, y: 0 };
  }, []);

  const handleContainerClick = () => {
    // Touch-friendly toggle on mobile/tablet
    setIsFanned((prev) => !prev);
  };

  const handleBookNavigate = (e, view) => {
    e.stopPropagation();
    if (setCurrentView && view) {
      setCurrentView(view);
    }
  };

  const isUrlSpread = typeof window !== 'undefined' && window.location.search.includes('spread=true');
  const shouldSpread = (isHovered || isFanned || isUrlSpread) && !prefersReducedMotion;

  return (
    <div className="hero-floating-bookstack-wrap">
      {/* 3D Scene Viewport - Floating directly on cream background */}
      <div
        ref={containerRef}
        className={`hero-floating-scene ${shouldSpread ? 'is-fanned' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleContainerClick}
        role="region"
        aria-label="Interactive 3D floating notebook collection"
      >
        {/* Soft Ambient Contact Shadow on the warm cream surface */}
        <div className="hero-floating-table-shadow" />

        {/* Master 3D Transform Pivot Stage */}
        <div
          className={`hero-floating-pivot ${prefersReducedMotion ? 'reduced-motion' : ''}`}
          style={{
            transform: prefersReducedMotion
              ? 'rotateX(8deg) rotateY(-6deg)'
              : `rotateX(${9 + tilt.x}deg) rotateY(${-10 + tilt.y}deg)`
          }}
        >
          {/* =========================================================
              1. LEFT BOOK: WARM CREAM NOTEBOOK
              Tilted behind center on the left: "Think. Learn. Grow."
              ========================================================= */}
          <div
            className={`notebook-3d notebook-left ${activeBook === 'left' ? 'is-active' : ''}`}
            onClick={(e) => handleBookNavigate(e, 'marketplace')}
            onMouseEnter={() => setActiveBook('left')}
            onMouseLeave={() => setActiveBook(null)}
            title="Explore Books: Think. Learn. Grow."
          >
            {/* Front Cover */}
            <div className="notebook-face notebook-face-front cover-cream">
              {/* Spine cloth binding tape on left */}
              <div className="notebook-spine-tape tape-cream" />
              {/* Subtle ruled notebook lines */}
              <div className="notebook-ruled-lines ruled-dark" />

              {/* Cover Content Frame */}
              <div className="notebook-cover-frame frame-cream">
                <div className="notebook-cover-header">
                  <span className="notebook-serial">VOL. 01 • CAMPUS ARCHIVE</span>
                  <span className="notebook-edition-pill pill-cream">ED. 2026</span>
                </div>

                <div className="notebook-cover-body">
                  <div className="notebook-monogram monogram-forest">LH</div>
                  <h3 className="notebook-title title-cream">
                    Think.
                    <br />
                    Learn.
                    <br />
                    <span className="title-highlight-terracotta">Grow.</span>
                  </h3>
                  <div className="notebook-divider divider-forest" />
                  <p className="notebook-subtitle subtitle-forest">
                    ACADEMIC BOOK EXCHANGE
                    <br />
                    PEER-TO-PEER CAMPUS HANDOVER
                  </p>
                </div>

                <div className="notebook-cover-footer footer-forest">
                  <span>LITHAVEN PRESS</span>
                  <span>NO. 01</span>
                </div>
              </div>

              {/* Soft specular sheen */}
              <div className="notebook-specular" />
            </div>

            {/* Back Cover */}
            <div className="notebook-face notebook-face-back cover-cream-back" />

            {/* Left Spine (Cloth Tape) */}
            <div className="notebook-face notebook-face-spine spine-cream">
              <span className="notebook-spine-text text-dark">THINK. LEARN. GROW. — LITHAVEN ARCHIVE</span>
            </div>

            {/* Paper Edges (Fore-edge & Top/Bottom) */}
            <div className="notebook-face notebook-pages-right" />
            <div className="notebook-face notebook-pages-top" />
            <div className="notebook-face notebook-pages-bottom">
              <div className="notebook-ribbon ribbon-terracotta" />
            </div>
          </div>

          {/* =========================================================
              2. RIGHT BOOK: TERRACOTTA ORANGE NOTEBOOK
              Tilted behind center on the right: "Read. Share. Repeat."
              ========================================================= */}
          <div
            className={`notebook-3d notebook-right ${activeBook === 'right' ? 'is-active' : ''}`}
            onClick={(e) => handleBookNavigate(e, 'marketplace')}
            onMouseEnter={() => setActiveBook('right')}
            onMouseLeave={() => setActiveBook(null)}
            title="Explore Books: Read. Share. Repeat."
          >
            {/* Front Cover */}
            <div className="notebook-face notebook-face-front cover-terracotta">
              {/* Spine cloth binding tape on left */}
              <div className="notebook-spine-tape tape-dark-terracotta" />
              {/* Tactile hinge crease */}
              <div className="notebook-hinge-crease" />
              {/* Subtle ruled notebook lines */}
              <div className="notebook-ruled-lines ruled-light" />

              {/* Cover Content Frame */}
              <div className="notebook-cover-frame frame-terracotta">
                <div className="notebook-cover-header">
                  <span className="notebook-serial">VOL. 03 • SUSTAINABLE CIRCULATION</span>
                  <span className="notebook-edition-pill pill-terracotta">ZERO WASTE</span>
                </div>

                <div className="notebook-cover-body">
                  <div className="notebook-monogram monogram-terracotta">CR</div>
                  <h3 className="notebook-title title-terracotta">
                    Read.
                    <br />
                    Share.
                    <br />
                    <span className="title-highlight-ivory">Repeat.</span>
                  </h3>
                  <div className="notebook-divider divider-terracotta" />
                  <p className="notebook-subtitle subtitle-terracotta">
                    SUSTAINABLE STUDENT CIRCULATION
                    <br />
                    AFFORDABLE CAMPUS LEARNING
                  </p>
                </div>

                <div className="notebook-cover-footer footer-terracotta">
                  <span>CAMPUS READER COLLECTIVE</span>
                  <span>NO. 03</span>
                </div>
              </div>

              {/* Soft specular sheen */}
              <div className="notebook-specular" />
            </div>

            {/* Back Cover */}
            <div className="notebook-face notebook-face-back cover-terracotta-back" />

            {/* Left Spine */}
            <div className="notebook-face notebook-face-spine spine-terracotta">
              <span className="notebook-spine-text text-light">READ. SHARE. REPEAT. — CAMPUS PRESS</span>
            </div>

            {/* Paper Edges */}
            <div className="notebook-face notebook-pages-right" />
            <div className="notebook-face notebook-pages-top" />
            <div className="notebook-face notebook-pages-bottom">
              <div className="notebook-ribbon ribbon-gold" />
            </div>
          </div>

          {/* =========================================================
              3. CENTER BOOK: FOREST GREEN NOTEBOOK (ON TOP)
              Central, prominent layer: "Notes that actually help."
              ========================================================= */}
          <div
            className={`notebook-3d notebook-center ${activeBook === 'center' ? 'is-active' : ''}`}
            onClick={(e) => handleBookNavigate(e, 'vault')}
            onMouseEnter={() => setActiveBook('center')}
            onMouseLeave={() => setActiveBook(null)}
            title="Explore Study Vault: Notes that actually help."
          >
            {/* Front Cover */}
            <div className="notebook-face notebook-face-front cover-forest">
              {/* Spine cloth binding tape on left */}
              <div className="notebook-spine-tape tape-dark-forest" />
              {/* Tactile hinge crease */}
              <div className="notebook-hinge-crease" />
              {/* Subtle gold foil ruled notebook lines */}
              <div className="notebook-ruled-lines ruled-gold" />

              {/* Cover Content Frame with Gold Accents */}
              <div className="notebook-cover-frame frame-forest">
                <div className="notebook-cover-header">
                  <span className="notebook-serial serial-gold">LITHAVEN ARCHIVE</span>

                </div>

                <div className="notebook-cover-body">
                  <div className="notebook-monogram monogram-gold">LH</div>
                  <h3 className="notebook-title title-forest">
                    Notes that
                    <br />
                    <span className="title-highlight-italic-gold">actually help.</span>
                  </h3>
                  <div className="notebook-divider divider-gold" />
                  <p className="notebook-subtitle subtitle-gold">
                    {/* VERIFIED TOPPER SUMMARIES
                    <br /> */}
                    SOLVED PAPERS & REVISION CAPSULES
                  </p>
                </div>

                <div className="notebook-cover-footer footer-gold">
                  <span>TOPPER CURATED</span>
                  <span>VOL. II</span>
                </div>
              </div>

              {/* Subtle metallic specular sheen */}
              <div className="notebook-specular" />
            </div>

            {/* Back Cover */}
            <div className="notebook-face notebook-face-back cover-forest-back" />

            {/* Left Spine */}
            <div className="notebook-face notebook-face-spine spine-forest">
              <span className="notebook-spine-text text-gold">NOTES THAT ACTUALLY HELP. — STUDY VAULT</span>
            </div>

            {/* Paper Edges */}
            <div className="notebook-face notebook-pages-right" />
            <div className="notebook-face notebook-pages-top" />
            <div className="notebook-face notebook-pages-bottom">
              <div className="notebook-ribbon ribbon-cream" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
