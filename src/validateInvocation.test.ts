import { validateInvocation } from './index';
import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';

test('should allow with valid domains as an array', async () => {
  await validateInvocation(
    createMockExecutionContext({
      instanceConfig: {
        domains: (['test.com ', 'test1.com'] as unknown) as string,
      },
    }),
  );
});

test('should allow with valid domains as a string', async () => {
  await validateInvocation(
    createMockExecutionContext({
      instanceConfig: {
        domains: 'test.com,test1.com,test2.com,test4.com',
      },
    }),
  );
});

test('should allow with valid domains and spaces in between', async () => {
  await validateInvocation(
    createMockExecutionContext({
      instanceConfig: {
        domains: 'test.com,test1.com, test2.com,test4.com',
      },
    }),
  );
});

test('should allow with valid domains and spaces before and after the list', async () => {
  await validateInvocation(
    createMockExecutionContext({
      instanceConfig: {
        domains: ' test.com,test1.com,test2.com,test4.com ',
      },
    }),
  );
});

test('should throw if a domain is invalid', async () => {
  await expect(
    validateInvocation(
      createMockExecutionContext({
        instanceConfig: {
          domains: ' test.com,INVALID_HERE,test1.com,test2.com,test4.com ',
        },
      }),
    ),
  ).rejects.toThrowError('Invalid domain name INVALID_HERE');
});

test('should throw if domain config is not provided', async () => {
  await expect(
    validateInvocation(
      createMockExecutionContext({
        instanceConfig: {} as any,
      }),
    ),
  ).rejects.toThrowError('config.domains must be provided by the user');
});
