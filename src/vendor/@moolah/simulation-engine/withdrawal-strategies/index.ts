import inflationAdjusted from './inflation-adjusted';
import notInflationAdjusted from './not-inflation-adjusted';
import portfolioPercent from './portfolio-percent';
import guytonKlinger from './guyton-klinger';
import ninetyFivePercentRule from './ninety-five-percent-rule';
import capeBased from './cape-based';
import { WithdrawalStrategies } from '../types';

export default {
  [WithdrawalStrategies.inflationAdjusted]: inflationAdjusted,
  [WithdrawalStrategies.notInflationAdjusted]: notInflationAdjusted,
  [WithdrawalStrategies.portfolioPercent]: portfolioPercent,
  [WithdrawalStrategies.guytonKlinger]: guytonKlinger,
  [WithdrawalStrategies.ninetyFivePercentRule]: ninetyFivePercentRule,
  [WithdrawalStrategies.capeBased]: capeBased,
};
