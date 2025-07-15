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
  height: 100%;
  width: 100%;
  position: relative;
  ${({ icon }) => `background-image: url(${icon});`}
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  animation: 2s infinite alternate floating;
  animation-timing-function: linear;

  z-index: 2;
  @keyframes floating {
    0% {
      transform: translatey(-50%);
    }

    50% {
      transform: translatey(-40%);
    }
    100% {
      transform: translatey(-50%);
    }
  }
`;
const KamiShadow = styled.div`
  position: absolute;
  height: 20%;
  position: relative;
  animation: 2s infinite alternate shadow;
  animation-timing-function: linear;

  @keyframes shadow {
    0% {
      width: 25%;
      box-shadow: 0px -15px 7px rgba(0, 0, 0, 0.9);
    }
    50% {
      width: 33%;
      box-shadow: 0px -15px 6.8px rgba(0, 0, 0, 1);
    }
    100% {
      width: 30%;
      box-shadow: 0px -15px 7px rgba(0, 0, 0, 0.9);
    }
  }
`;
