/**
 * Unit tests for Dashboard page (T-UD08, T-UD09).
 * Mocks useUserDetail hook entirely.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import DashboardPage from '@/app/(private)/dashboard/page';
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
  usePathname: () => '/dashboard',
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useUserDetail } = require('@/hooks/user/use-user-detail') as {
  useUserDetail: jest.Mock;
};

// ── T-UD08: renders real first name ──────────────────────────────────────────

describe('T-UD08 — Dashboard renders real user first name from hook', () => {
  it('displays firstName in welcome heading when data is loaded', () => {
    useUserDetail.mockReturnValue({
      userDetail: mockUserDetailResponses.success,
      isLoading: false,
      isError: false,
    });

    render(React.createElement(DashboardPage));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kaushik');
  });

  it('displays first + last name in profile card', () => {
    useUserDetail.mockReturnValue({
      userDetail: mockUserDetailResponses.success,
      isLoading: false,
      isError: false,
    });

    render(React.createElement(DashboardPage));

    expect(screen.getByText('Kaushik Parmar')).toBeInTheDocument();
  });
});

// ── T-UD09: renders loading skeleton ─────────────────────────────────────────

describe('T-UD09 — Dashboard renders skeleton while data is loading', () => {
  it('shows aria-busy skeleton and hides real name when isLoading is true', () => {
    useUserDetail.mockReturnValue({
      userDetail: undefined,
      isLoading: true,
      isError: false,
    });

    render(React.createElement(DashboardPage));

    const skeleton = document.querySelector('[aria-busy="true"]');
    expect(skeleton).not.toBeNull();
    expect(screen.queryByText('Kaushik')).not.toBeInTheDocument();
  });
});
