interface SuccessStateProps {
  title: string;
  subtitle: string;
}

export const SuccessState = ({ title, subtitle }: SuccessStateProps) => (
  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p>{subtitle}</p>
  </div>
);
