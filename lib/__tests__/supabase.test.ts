// Set environment variables untuk test SEBELUM requireActual
process.env.EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';

// Set flag untuk skip global mock
process.env.TEST_SUPABASE = 'true';

// Mock supabase sebelum import
const mockRefreshSession = jest.fn();

jest.mock('../supabase', () => {
  // Set env vars lagi di dalam mock untuk memastikan
  process.env.EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
  
  const actualModule = jest.requireActual('../supabase');
  return {
    ...actualModule,
    supabase: {
      ...actualModule.supabase,
      auth: {
        ...actualModule.supabase.auth,
        refreshSession: mockRefreshSession,
      },
    },
  };
});

import { handleSupabaseError, supabase } from '../supabase';

describe('handleSupabaseError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('harus melempar error asli jika bukan expired session error', async () => {
    const error = new Error('Network error');
    
    await expect(
      handleSupabaseError(error)
    ).rejects.toThrow('Network error');
  });

  it('harus melempar error asli jika error tidak memiliki message expired', async () => {
    const error = { message: 'Some other error', code: 'OTHER_ERROR' };
    
    await expect(
      handleSupabaseError(error)
    ).rejects.toEqual(error);
  });

  it('harus refresh session dan retry operasi jika error expired session', async () => {
    const mockSession = { access_token: 'new-token' };
    const mockRetryOperation = jest.fn().mockResolvedValue('success');
    
    // Mock refreshSession untuk return session yang valid
    mockRefreshSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const error = { message: 'JWT expired', status: 401 };
    
    const result = await handleSupabaseError(error, mockRetryOperation);
    
    expect(result).toBe('success');
    expect(mockRefreshSession).toHaveBeenCalled();
    expect(mockRetryOperation).toHaveBeenCalled();
  });

  it('harus melempar error jika refresh session gagal', async () => {
    const mockRetryOperation = jest.fn();
    
    // Mock refreshSession untuk return error
    mockRefreshSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Refresh failed'),
    });

    const error = { message: 'expired token', status: 401 };
    
    await expect(
      handleSupabaseError(error, mockRetryOperation)
    ).rejects.toThrow('Session expired. Please login again.');
    
    expect(mockRefreshSession).toHaveBeenCalled();
    expect(mockRetryOperation).not.toHaveBeenCalled();
  });

  it('harus mendeteksi expired session dari error code PGRST301', async () => {
    const mockRetryOperation = jest.fn().mockResolvedValue('success');
    const mockSession = { access_token: 'new-token' };
    
    mockRefreshSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const error = { code: 'PGRST301', message: 'Some error' };
    
    const result = await handleSupabaseError(error, mockRetryOperation);
    
    expect(result).toBe('success');
    expect(mockRefreshSession).toHaveBeenCalled();
    expect(mockRetryOperation).toHaveBeenCalled();
  });

  it('harus mendeteksi expired session dari status 401', async () => {
    const mockRetryOperation = jest.fn().mockResolvedValue('success');
    const mockSession = { access_token: 'new-token' };
    
    mockRefreshSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const error = { status: 401, message: 'Unauthorized' };
    
    const result = await handleSupabaseError(error, mockRetryOperation);
    
    expect(result).toBe('success');
    expect(mockRefreshSession).toHaveBeenCalled();
    expect(mockRetryOperation).toHaveBeenCalled();
  });

  it('harus melempar error jika tidak ada retryOperation untuk expired session', async () => {
    const error = { message: 'JWT expired', status: 401 };
    
    await expect(
      handleSupabaseError(error)
    ).rejects.toEqual(error);
  });
});

