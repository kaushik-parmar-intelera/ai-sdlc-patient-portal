using System.Net;

namespace PatientPortal.Api.Exceptions;

public class ApiException : Exception
{
    public string Code { get; }
    public int StatusCode { get; }

    public ApiException(string code, string message, int statusCode = (int)HttpStatusCode.BadRequest)
        : base(message)
    {
        Code = code;
        StatusCode = statusCode;
    }
}
