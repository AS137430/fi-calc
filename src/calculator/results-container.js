import React, { useRef, useState, useEffect } from 'react';
import classnames from 'classnames';
import './results-container.css';
import useTouchMotion from '../vendor/use-touch-motion';
import Results from './results';

export default function Overlay({ inputs, result, successRate }) {
  const el = useRef();
  const [isOpenClass, setIsOpenClass] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const disableTouch = useRef();

  useEffect(() => {
    disableTouch.current = false;
  }, []);

  const topY = -700;

  const openInfluencePoint = isOpen
    ? null
    : {
        x: 200,
        y: -255,
      };

  const closedInfluencePoint = !isOpen
    ? null
    : {
        x: 200,
        y: -700 + 180,
      };

  // The points here will need to be computed based on the size of the browser window...
  const [coordinates, transitionTo] = useTouchMotion({
    el,
    points: [
      { x: 200, y: topY, label: 'open', influencePoint: openInfluencePoint },
      {
        x: 200,
        y: -55,
        label: 'closed',
        initial: true,
        influencePoint: closedInfluencePoint,
      },
    ],
    movement: {
      x: null,
      up: !isOpen ? 400 - 55 : 0,
      down: isOpen ? 400 - 55 : 0,
    },
    onChangeDestination(newPosition) {
      console.log('wot', newPosition);
    },
    onMovementEnd(endPosition) {
      setIsOpen(endPosition.label === 'open');
      disableTouch.current = false;
    },
  });

  function toggle() {
    if (disableTouch.current) {
      return;
    }

    disableTouch.current = true;

    const targetPoint = isOpen ? 'closed' : 'open';
    transitionTo(targetPoint, { speed: 3200 });
    setIsOpenClass(targetPoint === 'open');
  }

  console.log('rendering', isOpenClass);

  return (
    <div
      ref={el}
      className={classnames('overlay', {
        'overlay-open': isOpenClass,
      })}
      style={{
        top: `${coordinates.y}px`,
      }}>
      <div className="calculator_resultsToggle" onClick={toggle} />
      <div className="calculator_resultsContent">
        <div className="calculator_buttonContainer">
          <button className="calculator_viewResultsBtn" onClick={toggle}>
            View Results
          </button>
        </div>
        <Results
          inputs={inputs}
          result={result}
          successRate={successRate}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
}
