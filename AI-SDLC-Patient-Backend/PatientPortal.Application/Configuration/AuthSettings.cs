namespace PatientPortal.Application.Configuration;

public class AuthSettings
{
    public string Issuer { get; set; } = "PatientPortal";
    public string Audience { get; set; } = "PatientPortalUsers";
    public string SigningKey { get; set; } = "SuperSecretSigningKeyChangeMe123";
    public int AccessTokenExpirationMinutes { get; set; } = 60;
    public int RefreshTokenExpirationDays { get; set; } = 30;
}
