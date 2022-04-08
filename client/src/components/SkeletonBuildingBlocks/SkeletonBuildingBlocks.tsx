import React from 'react';
import styled from 'styled-components';

type ShinyBlockProps = {
  height: string
  width?: string
}

export const ShinyBlock = styled.div<ShinyBlockProps>`
  &:empty {
    width: ${({ width }): string => (width ? width : '100%')};
    height: ${({ height }): string => height};
    background-color: rgba(225, 225, 225);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0)
    );
    background-repeat: repeat-y;
    background-size: 100px;
    border-radius: 3px 3px 3px 3px;
    animation: shine 2s infinite ease-out;
    @keyframes shine {
      from {
        background-position: left -100px top;
      }
      to {
        background-position: right -100px top;
      }
    }
  }
`

export const ShinyCircle = styled.div<ShinyBlockProps>`
  &:empty {
    width: ${({ height }): string => height};
    height: ${({ height }): string => height};
    border-radius: 50%;
    background-color: rgba(225, 225, 225);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0)
    );
    background-repeat: repeat-y;
    background-size: 100px;
    border-radius: 3px 3px 3px 3px;
    animation: shine 2s infinite ease-out;
    @keyframes shine {
      from {
        background-position: left -100px top;
      }
      to {
        background-position: right -100px top;
      }
    }
  }
`

type SpaceProps = {
  height?: string
  mobileHeight?: string
  desktopOnly?: boolean
}

export const Space = styled.div<SpaceProps>`
  display: ${({ desktopOnly }): string => (desktopOnly ? 'none' : 'block')};
  height: ${({ height, mobileHeight }): string => (mobileHeight ? mobileHeight : height ? height : '0.5rem')};

  @media (min-width: 992px) and (max-width : 1200px) {
    display: block;
    height: ${({ height }): string => (height ? height : '0.5rem')};
  }
`

type InlineFlexProps = {
  desktopOnly?: boolean
}

const InlineFlex = styled.div<InlineFlexProps>`
  flex-direction: row;
  display: ${({ desktopOnly }): string => (desktopOnly ? 'none' : 'flex')};
  @media (min-width: 992px) and (max-width : 1200px) {
    display: flex;
  }
`
export const ListItemSkeleton: React.FC<{ width: string; desktopOnly?: boolean }> = ({
  width,
  desktopOnly = false,
}) => (
  <InlineFlex desktopOnly={desktopOnly}>
    <ShinyCircle height="1.5rem" /> <Gap /> <ShinyBlock height="1.5rem" width={width} />
  </InlineFlex>
)

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const IconContainer = styled.div`
  height: 0;
  width: 0;

  @media (min-width: 992px) and (max-width : 1200px) {
    height: 15rem;
    width: 15rem;
  }
`
export const ShinyIcon: JSX.Element = (
  <CenteredContainer>
    <IconContainer>
      <ShinyCircle height="100%" />
    </IconContainer>
  </CenteredContainer>
)

type GapProps = {
  width?: string
}

export const Gap = styled.div<GapProps>`
  width: ${({ width }): string => (width ? width : '0.5rem')};
`