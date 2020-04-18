import React from 'react';
import { Link } from 'react-router-dom';
import './learn.css';

export default function Learn() {
  return (
    <div className="learn page">
      <h1 className="page_title">Planning for Retirement</h1>
      <p>
        When planning for retirement, you have an important decision to make:
        how much money will you withdraw from your investments each year during
        your retirement? You want to withdraw as much as you can to maximize
        your quality of life, but not so much that you run out of money.
      </p>
      <p>
        It's impossible to know with certainty how much you can safely withdraw
        each year, because we can't know how the market will perform during your
        retirement, nor how long we will live. What we can do, however, is make
        an educated guess.
      </p>
      <h2 className="page_h2">Finding a Safe Withdrawal Rate</h2>
      <p>
        In the early 90's, a financial advisor named William Bengen came up with
        a novel idea to determine a safe withdrawal rate: simulating retirements
        using historical data. He took a retirement plan and calculated how it
        would have performed if an individual had started their retirement in
        1871. After some number of years (he used 30 in his study), he
        determined if there was any money left in the portfolio. Then, he ran
        the simulation again, starting in the year 1872, and continued all the
        way through the present day.
      </p>
      <p>
        After running all of the simulations, he determined that retirement
        plans survived about 95% of the time with a 4% withdrawal rate. A few
        years after Bengen's study, a group of professors reconfirmed his
        results in a paper called The Trinity Study. This idea is now known as
        The 4% Rule, and it remains a foundational idea in retirement planning
        even today.
      </p>
      <p>
        This method of determing a safe withdrawal strategy is powerful if you
        believe that the market during your retirement will perform as least as
        well as the worst period since 1871.
      </p>
      <h2 className="page_h2">Other Withdrawal Strategies</h2>
      <p>
        In the time since the 4% Rule was originally conceived, new withdrawal
        strategies have been created that offer different pros and cons compared
        to The 4% Rule.
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
        includes others for you to explore, too, and those strategies are just
        as configurable. After running a simulation, you can download your
        results as an CSV and continue your investigation in your favorite
        spreadsheet app.
      </p>
      <p>
        FI Calc exists to give you additional data around your retirement plan
        so that you can retire with confidence.
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
