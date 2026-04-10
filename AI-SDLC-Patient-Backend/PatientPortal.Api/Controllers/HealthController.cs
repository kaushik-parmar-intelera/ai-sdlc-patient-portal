using Microsoft.AspNetCore.Mvc;

namespace PatientPortal.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class HealthController : ControllerBase
{
    [HttpGet("health")]
    [HttpHead("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
        });
    }

    [HttpGet("health/live")]
    public IActionResult Liveness()
    {
        return Ok(new
        {
            status = "live",
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("health/ready")]
    public IActionResult Readiness()
    {
        return Ok(new
        {
            status = "ready",
            timestamp = DateTime.UtcNow
        });
    }
}
