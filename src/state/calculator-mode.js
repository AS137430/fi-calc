import { useState } from 'react';
import constate from 'constate';

function useCalculatorMode() {
  const [calculatorMode, setCalculatorMode] = useState('allHistory');
  return [calculatorMode, setCalculatorMode];
}

const [CalculatorModeContext, useCalculatorModeContext] = constate(
  useCalculatorMode
);

export default useCalculatorModeContext;
export { CalculatorModeContext };
