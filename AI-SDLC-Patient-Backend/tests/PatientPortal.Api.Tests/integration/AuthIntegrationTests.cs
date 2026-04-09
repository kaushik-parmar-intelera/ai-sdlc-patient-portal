using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using PatientPortal.Api.Models.Error;
using Xunit;

namespace PatientPortal.Api.Tests.Integration;

public class AuthIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_ReturnsTokens_AndProtectedEndpointSucceeds()
    {
        var registration = new
        {
            fullName = "Adam Token",
            email = "adam.token@example.com",
            password = "TokenPassword123!",
            confirmPassword = "TokenPassword123!"
        };

        await _client.PostAsJsonAsync("/api/v1/auth/register", registration);

        var loginRequest = new
        {
            email = "adam.token@example.com",
            password = "TokenPassword123!"
        };

        var loginResponse = await _client.PostAsJsonAsync("/api/v1/auth/login", loginRequest);
        loginResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        var loginPayload = await loginResponse.Content.ReadFromJsonAsync<ApiResponse<PatientPortal.Application.Models.Auth.AuthResponse>>();
        loginPayload.Should().NotBeNull();
        loginPayload!.Data.Should().NotBeNull();

        var token = loginPayload.Data!.AccessToken;
        token.Should().NotBeNullOrWhiteSpace();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var userResponse = await _client.GetAsync("/api/v1/users/me");
        userResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        var userPayload = await userResponse.Content.ReadFromJsonAsync<ApiResponse<PatientPortal.Application.Models.Auth.UserDto>>();
        userPayload.Should().NotBeNull();
        userPayload!.Data.Should().NotBeNull();
        userPayload.Data!.Email.Should().Be("adam.token@example.com");
    }
}
