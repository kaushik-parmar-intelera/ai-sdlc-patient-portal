/**
 * Unit tests for Profile page (T-UD10).
 * Mocks useUserDetail hook entirely.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ProfilePage from '@/app/(private)/profile/page';
import { mockUserDetailResponses } from '@/mocks/user/user-detail.mock';

jest.mock('@/hooks/user/use-user-detail');
jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children);
  Link.displayName = 'Link';
  return Link;
});
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/profile',
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useUserDetail } = require('@/hooks/user/use-user-detail') as {
  useUserDetail: jest.Mock;
};

// ── T-UD10: renders real email ────────────────────────────────────────────────

describe('T-UD10 — Profile renders real email from hook', () => {
  it('displays real email in contact details section', () => {
    useUserDetail.mockReturnValue({
      userDetail: mockUserDetailResponses.success,
      isLoading: false,
      isError: false,
    });

    render(React.createElement(ProfilePage));

    expect(screen.getByText('kaushik@healthcare.com')).toBeInTheDocument();
  });

  it('displays real full name in profile header', () => {
    useUserDetail.mockReturnValue({
      userDetail: mockUserDetailResponses.success,
      isLoading: false,
      isError: false,
    });

    render(React.createElement(ProfilePage));

    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent('Kaushik Parmar');
  });

  it('shows skeleton while loading', () => {
    useUserDetail.mockReturnValue({
      userDetail: undefined,
      isLoading: true,
      isError: false,
    });

    render(React.createElement(ProfilePage));

    const skeleton = document.querySelector('[aria-busy="true"]');
    expect(skeleton).not.toBeNull();
    expect(screen.queryByText('kaushik@healthcare.com')).not.toBeInTheDocument();
  });
});
