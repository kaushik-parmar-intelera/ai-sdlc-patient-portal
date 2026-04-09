namespace PatientPortal.Api.Models.Error;

public class ErrorResponse
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public List<ValidationDetail> Details { get; set; } = new();
}
