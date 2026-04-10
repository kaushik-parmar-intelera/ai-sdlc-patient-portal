using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace PatientPortal.Api.Middleware;

public class ValidationMiddleware
{
    private readonly RequestDelegate _next;

    public ValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException)
        {
            throw;
        }
    }
}
