namespace PatientPortal.Application.Mappers;

public static class FullNameMapper
{
    public static (string firstName, string lastName) Split(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName))
        {
            return (string.Empty, string.Empty);
        }

        var trimmed = fullName.Trim();
        var tokens = trimmed.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        if (tokens.Length == 1)
        {
            return (tokens[0], string.Empty);
        }

        var firstName = tokens[0];
        var lastName = string.Join(' ', tokens.Skip(1));
        return (firstName, lastName);
    }
}
