import styled from 'styled-components';

interface LinkPart {
  text: string;
  href: string;
}
type TextPart = string | LinkPart;
interface Props {
  text: TextPart[];
  size?: number; // font size
  gapScale?: number; // lineheight proportion to font size
  isHidden?: boolean;
  linkColor?: string;
}

export const EmptyText = (props: Props) => {
  const { text, size, gapScale, isHidden, linkColor } = props;

  return (
    <Container isHidden={!!isHidden}>
      {text.map((part, index) =>
        typeof part === 'string' ? (
          <Text key={part} size={size ?? 1.2} gapScale={gapScale ?? 3}>
            {part}
          </Text>
        ) : (
          <Link
            key={`link-${index}`}
            href={part.href}
            target='_blank'
            rel='noopener noreferrer'
            size={size ?? 1.2}
            linkColor={linkColor}
            gapScale={gapScale ?? 3}
          >
            {part.text}
          </Link>
        )
      )}
    </Container>
  );
};
const Container = styled.div<{ isHidden: boolean }>`
  overflow-y: auto;
  height: 100%;
  padding: 0.6vw;

  display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  user-select: none;
`;

const Text = styled.div<{ size: number; gapScale: number }>`
  font-size: ${({ size }) => size}vw;
  line-height: ${({ size, gapScale }) => gapScale * size}vw;
  text-align: center;
`;

const Link = styled.a<{ size: number; linkColor?: string; gapScale: number }>`
  color: ${({ linkColor }) => linkColor ?? '#0077cc'};
  font-size: ${({ size }) => size}vw;
  line-height: ${({ size, gapScale }) => gapScale * size}vw;
  text-decoration: underline;
  &:hover {
    text-decoration: none;
  }
`;
