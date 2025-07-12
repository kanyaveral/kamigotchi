import { animate, createScope, Scope } from 'animejs';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  color: string;
  intensity: number;
}

export const Glow = (props: Props) => {
  const { children, color, intensity } = props;
  const scope = useRef<Scope | null>(null);
  const childRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!childRef.current) return;

    scope.current = createScope().add(() => {
      animate(childRef.current!, {
        boxShadow: [`0 0 0px ${color}`, `0 0 ${8 * intensity}px ${color}`, `0 0 0px ${color}`],
        duration: 1000,
        direction: 'alternate',
        easing: 'easeInOutSine',
        loop: true,
      });
    });

    return () => scope.current?.revert();
  }, [color, intensity]);

  return (
    <GlowWrapper ref={childRef} color={color}>
      {children}
    </GlowWrapper>
  );
};

const GlowWrapper = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  border: 0.15vw solid ${({ color }) => color};
  box-shadow: 0 0 0px ${({ color }) => color};
  display: flex;
`;
