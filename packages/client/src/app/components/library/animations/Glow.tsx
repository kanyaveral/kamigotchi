import { animate, createScope, Scope, svg } from 'animejs';
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
        loop: false,
        direction: 'alternate',
      });
      const { translateX, translateY, rotate } = svg.createMotionPath(pathRef.current!);

      particlesRef?.current?.forEach((particle, index) => {
        const delay = (index * 3500) / particleCount;
        if (!particle) return;
        animate(particle, {
          loop: false,
          easing: 'linear',
          delay: delay,

          translateX: translateX,
          translateY: translateY,
          rotate: rotate,
          scale: [
            { to: 1, ease: 'linear', duration: 200 },
            { to: 1.5, ease: 'linear', duration: 400 },
            { to: 2.5, ease: 'linear', duration: 400 },
            { to: 1.5, ease: 'linear', duration: 400 },
            { to: 1, ease: 'linear', duration: 200 },
          ],
          duration: 3000,
        });
      });
    });

    return () => scope.current?.revert();
  }, [particleCount]);

  return (
    <Wrapper>
      <SVG viewBox='4 4 31.5 31.5' preserveAspectRatio='none'>
        <path
          style={{ width: `100%`, height: `100%` }}
          ref={pathRef}
          d={SQUARE_PATH}
          stroke={color}
          strokeWidth={1}
          fill='none'
        />
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
  overflow: hidden;
`;

const SVG = styled.svg`
  position: absolute;
  border-radius: 20%;
`;

const Tracer = styled.div<{ color: string; intensity: number }>`
  position: absolute;
  width: 0.2vw;
  height: 0.2vw;
  border-radius: 40%;
  background: ${({ color }) => color};
  box-shadow: 0 0 ${({ intensity }) => 8 * intensity}px ${({ color }) => color};
`;
