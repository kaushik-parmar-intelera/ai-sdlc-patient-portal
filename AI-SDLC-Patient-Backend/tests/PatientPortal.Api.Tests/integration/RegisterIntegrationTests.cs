using System.Net.Http.Json;
using FluentAssertions;
using PatientPortal.Api.Models.Error;
using Xunit;

namespace PatientPortal.Api.Tests.Integration;

public class RegisterIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public RegisterIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_HappyPath_CreatesNewUser()
    {
        var request = new
        {
            fullName = "Sally Patient",
            email = "sally.patient@example.com",
            password = "Patient123!",
            confirmPassword = "Patient123!"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Created);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<PatientPortal.Application.Models.Auth.RegisterSuccessResponse>>();
        payload.Should().NotBeNull();
        payload!.Success.Should().BeTrue();
        payload.Data.Should().NotBeNull();
        payload.Data!.Email.Should().Be("sally.patient@example.com");
        payload.Data.FirstName.Should().Be("Sally");
        payload.Data.LastName.Should().Be("Patient");
    }
}
