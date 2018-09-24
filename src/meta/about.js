import React, { Component } from 'react';

export default class About extends Component {
  render() {
    return (
      <div className="standardPage">
        <h1 className="primaryHeader">The Financial Independence Calculator</h1>
        <p className="appParagraph">
          FI Calc is a calculator that helps you plan for financial independence
          (FI).
        </p>
        <p className="appParagraph">
          Being financially independent (FI) means that you don't <i>need</i> to
          work to make ends meet. Once you've reached FI, you have the option to
          retire from your day job, although you can continue working if you
          like.
        </p>
        <h1 className="secondaryHeader">What does this calculator do?</h1>
        <p className="appParagraph">
          This calculator helps you determine if a particular retirement plan is
          likely to succeed. You input how much you have invested in the stock
          market, how much you plan to spend each year, and how many years you
          plan to make a withdrawal, and the calculator returns a rate of
          success (such as 94%).
        </p>
        <p className="appParagraph">
          The stock market is an unpredictable thing, though. It can go up or
          down, seemingly at random. And sometimes, it crashes. It's challenging
          to make a prediction about something that is so volatile.
        </p>
        <h1 className="secondaryHeader">Making Stock Market Predictions</h1>
        <p className="appParagraph">
          This calculator works by looking at the past to make predictions about
          the future. Using stock market data that stretches all the way back to
          1871, it runs "simulated" retirements. If, at the end of a simulation,
          there's money left in the portfolio, then that's considered a
          successful simulation. The end result that you see is the percentage
          of simulations that succeeded.
        </p>
        <p className="appParagraph">
          For instance, if you plan to withdraw from your investments for 30
          years, then this calculator would run its first simulation starting at
          1871 and ending 30 years later in 1901. Then, it would run another
          simulation starting in 1872 and ending in 1902, and so on, all of the
          way through to the current year.
        </p>
        <p className="appParagraph">
          The number of simulations in each calculation can vary between 1 and
          more than 100, depending on the inputs that you give it. The result is
          more reliable with more simulations.
        </p>
        <h1 className="secondaryHeader">Where did this approach come from?</h1>
        <p className="appParagraph">
          This method of planning for retirement was conceived of in the mid
          90's by{' '}
          <a href="https://en.wikipedia.org/wiki/William_Bengen">
            William Bengen
          </a>
          , a financial advisor. A few years later, it was made popular by the{' '}
          <a href="https://en.wikipedia.org/wiki/Trinity_study">
            Trinity Study
          </a>
          .
        </p>
        <p className="appParagraph">
          The conclusion of these studies is now commonly referred to as the "4%
          Rule," which states that you can safely withdraw 4% of your portfolio
          each year if you plan for a retirement of 30 years.
        </p>
        <p className="appParagraph">
          You can repeat this result in this calculator: a 4% withdrawal rate
          yields a success rate of about 96% in a portfolio made up entirely of
          stocks, which seems relatively safe.
        </p>
        <p className="appParagraph">
          More and more people are using this information to plan their own
          financial independence and retirement. FI Calc exists to help you plan
          for yours.
        </p>
        <h1 className="secondaryHeader">Business Model</h1>
        <p className="appParagraph">
          FI Calc is provided for free. It will never display ads, and we do not
          sell or share any information that you provide.
        </p>
        <p className="appParagraph">
          The <a href="https://github.com/jamesplease/fi-calc">source code</a>{' '}
          of FI Calc is open source under the MIT license.
        </p>
      </div>
    );
  }
}
