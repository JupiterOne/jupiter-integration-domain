import invocationValidator from "./invocationValidator";

test("should allow with valid domains", async () => {
  await invocationValidator({
    instance: {
      config: {
        domains: "test.com,test1.com,test2.com,test4.com",
      },
    },
  } as any);
});

test("should allow with valid domains and spaces in between", async () => {
  await invocationValidator({
    instance: {
      config: {
        domains: "test.com,test1.com, test2.com,test4.com",
      },
    },
  } as any);
});

test("should allow with valid domains and spaces before and after the list", async () => {
  await invocationValidator({
    instance: {
      config: {
        domains: " test.com,test1.com,test2.com,test4.com ",
      },
    },
  } as any);
});

test("should throw if a domain is invalid", async () => {
  await expect(
    invocationValidator({
      instance: {
        config: {
          domains: " test.com,INVALID_HERE,test1.com,test2.com,test4.com ",
        },
      },
    } as any),
  ).rejects.toThrowError(
    "config.domain must contain all valid domains separated by commas",
  );
});

test("should throw if domain config is not provided", async () => {
  await expect(
    invocationValidator({
      instance: {
        config: {},
      },
    } as any),
  ).rejects.toThrowError("config.domains must be provided by the user");
});
