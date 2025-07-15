import styled from 'styled-components';

interface Props {
  icon: string;
}
export const FloatingOnMap = (props: Props) => {
  return (
    <KamiAndShadow>
      <KamiImage icon={props.icon} />
      <KamiShadow />
    </KamiAndShadow>
  );
};
const KamiAndShadow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const KamiImage = styled.div<{ icon: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  height: 70%;
  width: 70%;
  position: absolute;
  ${({ icon }) => `background-image: url(${icon});`}
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  animation: 2s infinite alternate floating;
  animation-timing-function: linear;

  z-index: 2;
  @keyframes floating {
    0% {
      transform: translatey(-25%);
    }

    50% {
      transform: translatey(-5%);
    }
    100% {
      transform: translatey(-25%);
    }
  }
`;

const KamiShadow = styled.div`
  position: absolute;
  height: 15%;
  animation: 2s infinite alternate shadow;
  animation-timing-function: linear;
  transform: translatey(260%);
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.3) 70%,
    transparent 100%
  );

  @keyframes shadow {
    0% {
      width: 25%;
    }
    50% {
      width: 43%;
    }
    100% {
      width: 30%;
    }
  }
`;
