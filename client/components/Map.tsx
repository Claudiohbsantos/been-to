import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import Datamap from 'react-datamaps';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import countries from '../countries'

const FullContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #9cc0f9;
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
  transform: translateX(
    ${({ $mapWidth }: PositionerProps) => (window.innerWidth - $mapWidth) / 2}px
  );

  display: flex;
`;

const isCountryCode = (className: string) => !!countries[className]

/**
 * Attemps to get country code from elements list of classNames.
 * Returns empty string if not found
 */
const getCountry = (target: EventTarget | null) => {
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


interface MapProps {
  setHovered: (countryCode: string) => void;
}

const isSameMap = (prevProps:MapProps, nextProps: MapProps) => {
  // TODO: until state is pulled out it should never rerender
  return true
}

const Map = ({ setHovered }: MapProps) => {
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

  useEffect(() => {
    const handleHover = (evt: MouseEvent) => {
      const country = getCountry(evt.target);
      setHovered(country);
    };

    const map = document.getElementById('mapcontainer');
    if (map) {
      map.addEventListener('mouseover', handleHover);
    }
    return () => map?.removeEventListener('mouseover', handleHover);
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
          <MapContainer onMouseUp={handleClick} id="mapcontainer">
            <Positioner $mapWidth={calculateWidth()}>
              <Datamap
                projection={projection}
                fills={{
                  defaultFill: '#94d2a5',
                  visited: '#ff0000',
                }}
                data={mapData}
                updateChoroplethOptions={{ reset: true }}
                geographyConfig={{
                  popupOnHover: false,
                  borderWidth: 0.5,
                  borderColor: '#739c7e',
                  highlightBorderWidth: 1,
                }}
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

export default memo(Map,isSameMap);
