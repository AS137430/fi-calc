import React from 'react';
import { Link } from 'react-router-dom';

export default function GettingStarted() {
  return (
    <div className="learn page">
      <h1 className="page_title">Getting Started</h1>
      <p>FI Calc is an app that helps you plan for retirement.</p>
      <p>
        When planning a retirement, you have an important decision to make: how
        much money will you withdraw from your investments each year? Most
        people wish to withdraw as much as they can to maximize their quality of
        life, but not so much that they run out of money.
      </p>
      <p>
        It's impossible to know with certainty how much we can safely withdraw
        each year, because we can't know how the market will perform during your
        retirement, nor how long we will live. But there are ways to make an
        informed decision.
      </p>
      <h2 className="page_h2">Finding a Safe Withdrawal Rate</h2>
      <p>
        In the early 90's, a financial advisor named William Bengen came up with
        a novel idea to determine a safe withdrawal rate: simulating retirements
        using historical data. He took a retirement plan and calculated how it
        would have performed if an individual had started their retirement in
        1926. After some number of years (he used 30 in his study), he
        determined if there was any money left in the portfolio. Then, he ran
        the simulation again, starting in the year 1927, and continued all the
        way through the present day.
      </p>
      <p>
        After running all of the simulations, he determined that retirement
        plans survived about 95% of the time with a 4% initial withdrawal rate.
        After the first year, you adjust the withdrawal amount for inflation to
        ensure that your purchasing power remains about the same.
      </p>
      <p>
        A few years after Bengen's study, a group of professors reconfirmed his
        results in a paper called The Trinity Study. This idea is now known as
        The 4% Rule, and it remains a foundational idea in retirement planning
        even today.
      </p>
      <p>
        This method of determing a safe withdrawal strategy is powerful if you
        believe that the market during your retirement will perform no worse
        than the worst market in the available data set.
      </p>
      <h2 className="page_h2">Other Withdrawal Strategies</h2>
      <p>
        In the time since the 4% Rule was originally conceived, new withdrawal
        strategies have been created that offer pros and cons compared to The 4%
        Rule.
      </p>
      <p>
        What other strategies exist, and which one is most appropriate for you?
        You can use FI Calc to find these answers.
      </p>
      <h2 className="page_h2">Using FI Calc</h2>
      <p>
        This calculator allows you to run your retirement simulations using
        historical data, just like Bengen. You can recreate his original
        results, or tweak the inputs to discover new results. Run retirements
        that are shorter or longer, or that withdraw less or more, and see how
        these changes impact success rates.
      </p>
      <p>
        In addition to the withdrawal strategy used in The 4% Rule, FI Calc
        includes others that you can use, too, and those strategies are just as
        configurable. You can export your results as a CSV file and continue
        your calculations in your spreadsheet app of choice.
      </p>
      <p>
        You're now ready to jump in and start running simulations – have fun!
      </p>
      <div className="page_ctas">
        <Link to="/calculator" className="button page_ctaBtn">
          Launch Calculator
        </Link>
      </div>
    </div>
  );
}
