interface ErrorBannerProps {
  code: string;
  message: string;
  recoveryAction: string;
}

export const ErrorBanner = ({ code, message, recoveryAction }: ErrorBannerProps) => (
  <div role="alert" className="rounded-md border border-red-300 bg-red-100 p-3 text-red-900">
    <strong>[{code}]</strong> {message} - {recoveryAction}
  </div>
);
