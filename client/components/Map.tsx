import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Datamap from 'react-datamaps';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const FullContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;

  & .datamap path {
    cursor: pointer;
  }
`;

interface PositionerProps {
  $mapWidth: number;
}

const Positioner = styled.div`
  // TODO: magic number
  transform: translateX(
    ${({ $mapWidth }: PositionerProps) => (window.innerWidth - $mapWidth) / 2}px
  );

  display: flex;
`;

// TODO: check class against defined list of country codes
const isCountryCode = (className: string) => className.length === 3;

/**
 * Attemps to get country code from elements list of classNames.
 * Returns empty string if not found
 */
const getCountry = (target: EventTarget) => {
  if (!(target as Element)?.classList) return '';

  let country = '';
  (target as Element).classList.forEach((className) => {
    if (isCountryCode(className)) country = className;
  });
  return country;
};

interface countryData {
  fillKey: 'visited' | 'defaultFill';
}

/**
 * adds or remove country to object with fillKey 'visited'.
 * Doesn't mutate object passed as first param.
 * @param mapData Map mapData state object
 * @param country Country code string
 */
const toggleCountryVisited = (mapData: Record<string, countryData>, country: string) => {
  const dataCopy = { ...mapData };
  if (dataCopy[country]) {
    delete dataCopy[country];
    return dataCopy;
  }

  dataCopy[country] = { fillKey: 'visited' };
  return dataCopy;
};

const Map = () => {
  const [mapData, setMapData] = useState({});
  const [winHeight, setHeight] = useState(window.innerHeight);
  const [winWidth, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const projection = 'mercator';
  const mapRatios = {
    mercator: 568 / 360.94,
  };

  const calculateWidth = () => {
    if (winHeight > winWidth) return winWidth * mapRatios[projection];
    return winHeight * mapRatios[projection] * 0.9;
  };

  // variable used to track whether click is part of a drag or not
  let isDragging = false;
  const handleClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    const country = getCountry(evt.target);
    if (isDragging || !country) return;
    setMapData(toggleCountryVisited(mapData, country));
  };

  return (
    <FullContainer>
      <TransformWrapper
        wheel={{ step: 100 }}
        options={{ limitToBounds: false }}
        onPanningStop={() => {
          isDragging = false;
        }}
        onPanning={() => {
          isDragging = true;
        }}
      >
        {/* {({ setPositionY }: TransformWrapperReturns) => ( */}
        <TransformComponent>
          <MapContainer onMouseUp={handleClick}>
            <Positioner $mapWidth={calculateWidth()}>
              <Datamap
                projection={projection}
                fills={{
                  defaultFill: '#ABDDA4',
                  visited: '#ff0000',
                }}
                data={mapData}
                updateChoroplethOptions={{ reset: true }}
                geographyConfig={{ popupOnHover: false }}
                height={winHeight}
                width={calculateWidth()}
              />
            </Positioner>
          </MapContainer>
        </TransformComponent>
        {/* )} */}
      </TransformWrapper>
    </FullContainer>
  );
};

export default Map;
