namespace PatientPortal.Api.Models.Error;

public class MetaInfo
{
    public string Timestamp { get; set; } = DateTime.UtcNow.ToString("o");
    public string Version { get; set; } = "1.0";
}
