import { animate, createScope, Scope, svg } from 'animejs';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  color: string;
  intensity: number;
  particleCount?: number;
}

const SQUARE_PATH = 'M 5 5 L 35 5 L 35 35 L 5 35 Z';
const SMALLER_SQUARE_PATH = 'M 5 5 L 32 5 L 32 33 L 5 33 Z';

export const Glow = (props: Props) => {
  const { color, intensity, particleCount = 8 } = props;
  const scope = useRef<Scope | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const particlesRef = useRef<Array<HTMLDivElement | null>>(new Array(particleCount).fill(null));
  const innerPathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (!pathRef.current || particlesRef?.current?.length === 0) return;

    scope.current = createScope().add(() => {
      animate(svg.createDrawable(pathRef.current!), {
        draw: '0 1',
        easing: 'linear',
        duration: 2000,
        loop: false,
        ease: 'easeInOutCubic',
      });
      const { translateX, translateY, rotate } = svg.createMotionPath(innerPathRef.current!);

      particlesRef?.current?.forEach((particle, index) => {
        const delay = index * 200;
        if (!particle) return;
        animate(particle, {
          loop: false,
          easing: 'linear',
          delay: delay,
          opacity: [
            { value: 0, duration: 200 },
            { value: 1, duration: 1200 },
            { value: 0, duration: 600 },
          ],

          translateX: translateX,
          translateY: translateY,
          rotate: rotate,
          ease: 'easeInOutCubic',

          duration: 800,
        }).then(() => {
          if (particle) {
            particle.style.opacity = '0';
          }
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
        />{' '}
        <path ref={innerPathRef} d={SMALLER_SQUARE_PATH} fill='none' style={{ display: 'none' }} />
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
`;

const Tracer = styled.div<{ color: string; intensity: number }>`
  position: absolute;
  width: 0.2vw;
  height: 0.2vw;
  border-radius: 40%;
  background: ${({ color }) => color};
  box-shadow: 0 0 ${({ intensity }) => 8 * intensity}px ${({ color }) => color};
`;
