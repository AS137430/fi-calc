import React from 'react';
import SidebarPanel from './sidebar-panel';
import ChoiceButton from '../common/choice-button';
import useCalculatorMode from '../state/calculator-mode';

export default function Mode() {
  const [mode, setMode] = useCalculatorMode();

  return (
    <SidebarPanel>
      <ChoiceButton.ChoiceButtonGroup className="modeSelection">
        <ChoiceButton
          checked={mode === 'allHistory'}
          onChange={() => setMode('allHistory')}>
          Use all historical data
        </ChoiceButton>
        <ChoiceButton
          checked={mode === 'specificYears'}
          onChange={() => setMode('specificYears')}>
          Choose specific years
        </ChoiceButton>
      </ChoiceButton.ChoiceButtonGroup>
    </SidebarPanel>
  );
}
