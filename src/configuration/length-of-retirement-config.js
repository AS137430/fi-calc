import React, { useState } from 'react';
import ConfigSection from './config-section';
import useForm from '../hooks/use-form';
import Modal from '../common/modal';
import Input from '../common/input';
import useLengthOfRetirement from '../state/length-of-retirement';
import lengthOfRetirementForm from '../form-config/length-of-retirement-form';

export default function LengthOfRetirementConfig() {
  const { inputs, commitInput } = useForm({
    formConfig: lengthOfRetirementForm,
    useSourceOfTruth: useLengthOfRetirement,
  });
  const [isTitleInfoModalOpen, setIsTitleInfoModalOpen] = useState(false);

  return (
    <>
      <ConfigSection
        title="Length of Retirement"
        onHelpClick={() => setIsTitleInfoModalOpen(true)}>
        <div className="formRow">
          <Input
            {...inputs.numberOfYears.getProps({
              id: 'numberOfYears',
              className: 'input-years',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              max: 300,
              step: 1,
              inputMode: 'numeric',
              autoComplete: 'off',
              suffix: 'years',
              onCommit(event, newValue) {
                commitInput('numberOfYears', newValue);
              },
            })}
          />
        </div>
      </ConfigSection>
      <Modal
        active={isTitleInfoModalOpen}
        onBeginClose={() => setIsTitleInfoModalOpen(false)}>
        <Modal.Title>Length of Retirement</Modal.Title>
        <Modal.Body>
          <p>
            This is the number of years that you think your retirement might
            last. Of course, we cannot ever know this number with certainty, but
            we can make a reasonable guess.
          </p>
          <p>
            The studies that derived the 4% rule used 30 year retirements in
            their calculations, which is why the default length of this
            calculator is 30 years.
          </p>
          <p>
            One thing to note is that these studies were considering retirements
            for "typically aged" retirees: folks who retire at around age 60.
            For retirements starting at this age, you might agree that 30 years
            is a reasonable estimate.
          </p>
          <p>
            However, if you are planning to retire earlier than 60, you may
            decide it would be more appropriate to choose a longer retirement
            length. Feel free to do this! However, keep in mind that it is
            important to balance the <b>number of simulations</b> that are run
            in each calculation with your retirement length.
          </p>
          <p>
            The way that this calculator works is by running simulations of
            retirements from 1871 through to the current year. There are more 30
            year periods between 1871 and today than there are, say, 60 year
            periods. Consequently, you get more simulations per calculation with
            shorter retirement lengths.
          </p>
          <p>
            The more simulations that are run, the better, because that means
            your retirement plan experiences more situations. This is why it
            isn't useful to specify extremely long retirement lengths, like 100
            years. With huge retirement lengths, so few simulations are run that
            the result just isn't meaningful.
          </p>
          <p>
            There is no single right answer when it comes to retirement length.
            Many early retirees feel confident using 30 years. Hopefully, you
            now have the information you need to choose a retirement length that
            feels right to you.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button button-primary"
            type="button"
            onClick={() => setIsTitleInfoModalOpen(false)}>
            Okay
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
