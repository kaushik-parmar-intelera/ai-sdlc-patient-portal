namespace PatientPortal.Api.Models.Error;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public ErrorResponse? Error { get; set; }
    public MetaInfo Meta { get; set; } = new MetaInfo();
}
