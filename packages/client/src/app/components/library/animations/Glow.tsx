import { animate, createScope, Scope } from 'animejs';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  color: string;
  intensity: number;
}

export const Glow = ({ children, color, intensity }: Props) => {
  const scope = useRef<Scope | null>(null);
  const childRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!childRef.current) return;

    scope.current = createScope().add(() => {
      animate(childRef.current!, {
        boxShadow: [`0 0 0px ${color}`, `0 0 ${30}px ${color}`, `0 0 0px ${color}`],
        duration: 1000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
      });
    });

    return () => scope.current?.revert();
  }, []);

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
  position: relative;
`;
