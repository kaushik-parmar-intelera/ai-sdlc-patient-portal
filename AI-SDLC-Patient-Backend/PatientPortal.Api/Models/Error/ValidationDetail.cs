namespace PatientPortal.Api.Models.Error;

public class ValidationDetail
{
    public string Field { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}
