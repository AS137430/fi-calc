import React from 'react';
import SidebarPanel from './sidebar-panel';
import ChoiceButton from '../common/choice-button';
import useCalculatorMode from '../state/calculator-mode';

const modes = [
  {
    key: 'allHistory',
    display: 'Multiple simulations',
  },
  {
    key: 'specificYears',
    display: 'Single simulation',
  },
];

export default function Mode() {
  const [mode, setMode] = useCalculatorMode();

  return (
    <SidebarPanel>
      <select
        id="country"
        value={mode}
        className="select"
        onChange={e => setMode(e.target.value)}>
        {modes.map(val => (
          <option key={val.key} value={val.key}>
            {val.display}
          </option>
        ))}
      </select>
    </SidebarPanel>
  );
}
