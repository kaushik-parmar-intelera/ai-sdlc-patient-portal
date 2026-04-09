using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using PatientPortal.Api.Exceptions;
using PatientPortal.Api.Models.Error;
using PatientPortal.Application.Exceptions;

namespace PatientPortal.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException validationException)
        {
            await WriteValidationResponseAsync(context, validationException);
        }
        catch (ApiException apiException)
        {
            await WriteApiErrorAsync(context, apiException.Code, apiException.Message, apiException.StatusCode);
        }
        catch (AppException appException)
        {
            await WriteApiErrorAsync(context, appException.Code, appException.Message, appException.StatusCode);
        }
        catch (UnauthorizedAccessException unauthorizedAccessException)
        {
            await WriteApiErrorAsync(context, "INVALID_CREDENTIALS", unauthorizedAccessException.Message, (int)HttpStatusCode.Unauthorized);
        }
        catch (Exception exception)
        {
            var environment = context.RequestServices.GetService<IWebHostEnvironment>();
            var developerMessage = environment?.IsDevelopment() == true ? exception.ToString() : null;
            await WriteApiErrorAsync(context, "INTERNAL_ERROR", "An unexpected error occurred.", (int)HttpStatusCode.InternalServerError, developerMessage);
        }
    }

    private static Task WriteValidationResponseAsync(HttpContext context, ValidationException exception)
    {
        var details = exception.Errors
            .Select(error => new ValidationDetail
            {
                Field = error.PropertyName,
                Reason = error.ErrorMessage
            })
            .ToList();

        var response = new ApiResponse<object>
        {
            Success = false,
            Error = new ErrorResponse
            {
                Code = "INVALID_INPUT",
                Message = "Request validation failed",
                Details = details
            }
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }

    private static Task WriteApiErrorAsync(HttpContext context, string code, string message, int statusCode, string? developerMessage = null)
    {
        var response = new ApiResponse<object>
        {
            Success = false,
            Error = new ErrorResponse
            {
                Code = code,
                Message = message,
                Details = new List<ValidationDetail>()
            }
        };

        if (!string.IsNullOrWhiteSpace(developerMessage))
        {
            response.Error.Details.Add(new ValidationDetail { Field = "server", Reason = developerMessage });
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
