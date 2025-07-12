import { animate, createScope, Scope, svg } from 'animejs';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  color: string;
  intensity: number;
}

const SQUARE_PATH = 'M 5 5 L 35 5 L 35 35 L 5 35 Z';

export const Glow = (props: Props) => {
  const { color, intensity } = props;
  const scope = useRef<Scope | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const tracerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pathRef.current || !tracerRef.current) return;

    scope.current = createScope().add(() => {
      animate(svg.createDrawable(pathRef.current!), {
        draw: '0 1',
        easing: 'linear',
        duration: 1000,
        loop: false,
        direction: 'alternate',
      });
    });

    return () => scope.current?.revert();
  }, []);

  // will need to use viewBox as props to scale the svg
  return (
    <Wrapper>
      <SVG viewBox='4 4 31.5 31.5' preserveAspectRatio='none'>
        <path ref={pathRef} d={SQUARE_PATH} stroke={color} strokeWidth={1} fill='none' />
      </SVG>
      <Tracer ref={tracerRef} color={color} intensity={intensity} className='car' />
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
`;
const Tracer = styled.div<{ color: string; intensity: number }>`
  background-color: ${({ color }) => color};

  position: absolute;
  box-shadow: 0 0 ${({ intensity }) => 8 * intensity}px ${({ color }) => color};
`;
