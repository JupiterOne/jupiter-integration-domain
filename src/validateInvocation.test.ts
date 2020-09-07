import { validateInvocation } from './index';

test('should allow with valid domains as an array', async () => {
  await validateInvocation({
    instance: {
      config: {
        domains: ['test.com ', 'test1.com'],
      },
    },
  } as any);
});

test('should allow with valid domains as a string', async () => {
  await validateInvocation({
    instance: {
      config: {
        domains: 'test.com,test1.com,test2.com,test4.com',
      },
    },
  } as any);
});

test('should allow with valid domains and spaces in between', async () => {
  await validateInvocation({
    instance: {
      config: {
        domains: 'test.com,test1.com, test2.com,test4.com',
      },
    },
  } as any);
});

test('should allow with valid domains and spaces before and after the list', async () => {
  await validateInvocation({
    instance: {
      config: {
        domains: ' test.com,test1.com,test2.com,test4.com ',
      },
    },
  } as any);
});

test('should throw if a domain is invalid', async () => {
  await expect(
    validateInvocation({
      instance: {
        config: {
          domains: ' test.com,INVALID_HERE,test1.com,test2.com,test4.com ',
        },
      },
    } as any),
  ).rejects.toThrowError('Invalid domain name INVALID_HERE');
});

test('should throw if domain config is not provided', async () => {
  await expect(
    validateInvocation({
      instance: {
        config: {},
      },
    } as any),
  ).rejects.toThrowError('config.domains must be provided by the user');
});
