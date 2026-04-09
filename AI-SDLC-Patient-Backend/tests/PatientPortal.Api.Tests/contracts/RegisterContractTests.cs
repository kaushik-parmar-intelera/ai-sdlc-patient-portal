using System.Net.Http.Json;
using FluentAssertions;
using PatientPortal.Api.Models.Error;
using PatientPortal.Application.Models.Auth;
using Xunit;

namespace PatientPortal.Api.Tests.Contracts;

public class RegisterContractTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public RegisterContractTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ReturnsCreated_WithSuccessEnvelope()
    {
        var request = new
        {
            fullName = "Jane Doe",
            email = "jane.doe@example.com",
            password = "SecurePassword123!",
            confirmPassword = "SecurePassword123!"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Created);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<RegisterSuccessResponse>>();

        payload.Should().NotBeNull();
        payload!.Success.Should().BeTrue();
        payload.Error.Should().BeNull();
        payload.Data.Should().NotBeNull();
        payload.Data!.Email.Should().Be("jane.doe@example.com");
        payload.Data.FirstName.Should().Be("Jane");
        payload.Data.LastName.Should().Be("Doe");
    }
}
