import { registerUser } from '@/services/auth/register.service';
import { mockResponses, validRegistrationInput } from '@/mocks/auth/register.mock';

describe('registerUser API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('Successful Registration (201)', () => {
    it('should return RegistrationSuccess on 201 response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), {
          status: mockResponses.success.status,
        })
      );

      const result = await registerUser(validRegistrationInput);

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('message');
      expect((result as any).userId).toBe('usr_e7f4c2d9b1a5');
    });

    it('should send correct request headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), {
          status: 201,
        })
      );

      await registerUser(validRegistrationInput);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
    });

    it('should send request body with user data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), {
          status: 201,
        })
      );

      await registerUser(validRegistrationInput);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(JSON.parse(callArgs[1].body)).toEqual(validRegistrationInput);
    });
  });

  describe('Validation Error (400)', () => {
    it('should return RegistrationError with INVALID_INPUT code', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.validationError.response), {
          status: mockResponses.validationError.status,
        })
      );

      const result = await registerUser(validRegistrationInput);

      expect(result).toHaveProperty('errorCode');
      expect((result as any).errorCode).toBe('INVALID_INPUT');
      expect(result).toHaveProperty('error');
    });

    it('should include field information when available', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.validationError.response), {
          status: 400,
        })
      );

      const result = await registerUser(validRegistrationInput);

      expect((result as any).field).toBe('email');
    });
  });

  describe('Email Already Registered (409)', () => {
    it('should return RegistrationError with EMAIL_EXISTS code', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.emailExists.response), {
          status: mockResponses.emailExists.status,
        })
      );

      const result = await registerUser(validRegistrationInput);

      expect((result as any).errorCode).toBe('EMAIL_EXISTS');
      expect((result as any).error).toContain('Email already registered');
    });
  });

  describe('Server Error (500)', () => {
    it('should return generic error message (no stack traces)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.serverError.response), {
          status: mockResponses.serverError.status,
        })
      );

      const result = await registerUser(validRegistrationInput);

      expect((result as any).errorCode).toBe('SERVER_ERROR');
      expect((result as any).error).not.toContain('stack');
      expect((result as any).error).toContain('Unable to create account');
    });
  });

  describe('Network Error Handling', () => {
    it('should return NETWORK_ERROR code on fetch failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failed'));

      // Suppress console errors during test
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await registerUser(validRegistrationInput);

      expect((result as any).errorCode).toBe('NETWORK_ERROR');
      expect((result as any).error).toContain('internet connection');

      (console.error as jest.Mock).mockRestore();
    });

    it('should implement exponential backoff on network error', async () => {
      jest.useFakeTimers();

      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network failed'))
        .mockRejectedValueOnce(new Error('Network failed'))
        .mockResolvedValueOnce(
          new Response(JSON.stringify(mockResponses.success.response), {
            status: 201,
          })
        );

      jest.spyOn(console, 'error').mockImplementation(() => {});

      const promise = registerUser(validRegistrationInput);

      // Advance by first delay
      jest.advanceTimersByTime(2000);
      // Advance by second delay
      jest.advanceTimersByTime(5000);

      const result = await promise;

      expect((result as any).userId).toBe('usr_e7f4c2d9b1a5');
      expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(1);

      (console.error as jest.Mock).mockRestore();
      jest.useRealTimers();
    });

    it('should fail after 3 attempts', async () => {
      jest.useFakeTimers();

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failed'));

      jest.spyOn(console, 'error').mockImplementation(() => {});

      const promise = registerUser(validRegistrationInput);

      jest.runAllTimers();

      const result = await promise;

      expect((result as any).errorCode).toBe('NETWORK_ERROR');

      (console.error as jest.Mock).mockRestore();
      jest.useRealTimers();
    });
  });

  describe('API Endpoint', () => {
    it('should call /api/auth/register endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), {
          status: 201,
        })
      );

      await registerUser(validRegistrationInput);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe('/api/auth/register');
    });

    it('should use POST method', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponses.success.response), {
          status: 201,
        })
      );

      await registerUser(validRegistrationInput);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].method).toBe('POST');
    });
  });
});
