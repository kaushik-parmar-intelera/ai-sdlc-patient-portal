'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { getUserDetail } from '@/services/user/user-detail.service';
import {
  isUserDetailError,
  isUserDetailSuccess,
  type UserDetailSuccess,
} from '@/types/auth.types';

/**
 * React Query hook that fetches the authenticated user's detail.
 *
 * - Caches for 5 minutes (staleTime: 300_000)
 * - Fires toast.success once on first successful load
 * - Fires toast.error with a code-specific message on failure
 * - Redirects to /login on INVALID_TOKEN
 * - Never throws
 */
export function useUserDetail() {
  const router = useRouter();
  const toastFiredRef = useRef(false);

  const query = useQuery({
    queryKey: ['user', 'detail'],
    queryFn: getUserDetail,
    staleTime: 300_000,
  });

  useEffect(() => {
    if (!query.data) return;

    if (isUserDetailSuccess(query.data) && !toastFiredRef.current) {
      toastFiredRef.current = true;
      toast.success('Profile loaded successfully.');
      return;
    }

    if (isUserDetailError(query.data)) {
      const { errorCode } = query.data;
      if (errorCode === 'INVALID_TOKEN') {
        toast.error('Session expired. Please sign in again.');
        router.push('/login');
      } else if (errorCode === 'USER_NOT_FOUND') {
        toast.error('User account not found. Please contact support.');
      } else {
        toast.error('Unable to load profile. Please try again.');
      }
    }
  }, [query.data, router]);

  const userDetail: UserDetailSuccess | undefined =
    query.data && isUserDetailSuccess(query.data) ? query.data : undefined;

  return {
    userDetail,
    isLoading: query.isLoading,
    isError: !!query.data && isUserDetailError(query.data),
  };
}
