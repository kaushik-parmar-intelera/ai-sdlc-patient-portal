using System.Net.Http.Json;
using FluentAssertions;
using PatientPortal.Api.Models.Error;
using Xunit;

namespace PatientPortal.Api.Tests.Integration;

public class ValidationIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ValidationIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ReturnsFieldLevelError_ForMissingFullName()
    {
        var request = new
        {
            fullName = "",
            email = "missing.fullname@example.com",
            password = "Password123!",
            confirmPassword = "Password123!"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        payload.Should().NotBeNull();
        payload!.Error!.Code.Should().Be("INVALID_INPUT");
        payload.Error.Details.Should().Contain(detail => detail.Field == "FullName" || detail.Field == "fullName");
    }
}
