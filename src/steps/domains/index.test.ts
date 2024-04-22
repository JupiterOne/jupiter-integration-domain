import {
  Recording,
  executeStepWithDependencies,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../../constants';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetch-domains', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetchDomains',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.DOMAIN);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
