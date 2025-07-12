import { animate, createScope, createSpring, Scope, svg } from 'animejs';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  color: string;
  intensity: number;
  particleCount?: number;
}

const SQUARE_PATH = 'M 5 5 L 35 5 L 35 35 L 5 35 Z';

export const Glow = (props: Props) => {
  const { color, intensity, particleCount = 8 } = props;
  const scope = useRef<Scope | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const particlesRef = useRef<Array<HTMLDivElement | null>>(new Array(particleCount).fill(null));

  useEffect(() => {
    if (!pathRef.current || particlesRef?.current?.length === 0) return;

    scope.current = createScope().add(() => {
      animate(svg.createDrawable(pathRef.current!), {
        draw: '0 1',
        easing: 'linear',
        duration: 2000,
        loop: true,
        direction: 'alternate',
      });

      // Animate each particle with slight delay offset
      particlesRef?.current?.forEach((particle, index) => {
        const delay = (index * 1500) / particleCount; // Stagger particles
        if (!particle) return;
        animate(particle, {
          loop: true,
          easing: 'linear',
          delay: delay,
          opacity: [
            { value: 1, duration: 50 },
            { value: 0, duration: 100 },
          ],
          translateX: [
            { to: '-30%', duration: 50, easing: 'easeInOutSine' },
            { to: '30%', duration: 50, easing: 'easeInOutSine' },
            { to: '-30%', duration: 50, easing: 'easeInOutSine' },
          ],
          translateY: ['150%', '-500%'],
          scale: [
            { to: 2.25, ease: 'inOut(3)', duration: 200 },
            { to: 1, ease: createSpring({ stiffness: 3000 }) },
          ],
          duration: 1500,
        });
      });
    });

    return () => scope.current?.revert();
  }, [particleCount]);

  return (
    <Wrapper>
      <SVG viewBox='4 4 31.5 31.5' preserveAspectRatio='none'>
        <path ref={pathRef} d={SQUARE_PATH} stroke={color} strokeWidth={1} fill='none' />
      </SVG>
      {Array.from({ length: particleCount }, (_, i) => (
        <Tracer
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
          color={color}
          intensity={intensity}
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SVG = styled.svg`
  position: absolute;
  border-radius: 20%;
`;

const Tracer = styled.div<{ color: string; intensity: number }>`
  position: absolute;
  width: 0.2vw;
  height: 0.2vw;
  border-radius: 50%;
  background: ${({ color }) => color};
  box-shadow: 0 0 ${({ intensity }) => 8 * intensity}px ${({ color }) => color};
`;
