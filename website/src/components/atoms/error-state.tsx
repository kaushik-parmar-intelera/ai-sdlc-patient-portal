interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
    <p>{message}</p>
    {onRetry ? (
      <button className="mt-3 rounded bg-red-600 px-3 py-1 text-white" onClick={onRetry} type="button">
        Retry
      </button>
    ) : null}
  </div>
);
