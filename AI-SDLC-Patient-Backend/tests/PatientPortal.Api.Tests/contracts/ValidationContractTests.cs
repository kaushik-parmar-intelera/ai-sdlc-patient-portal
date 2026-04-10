using System.Net.Http.Json;
using FluentAssertions;
using PatientPortal.Api.Models.Error;
using Xunit;

namespace PatientPortal.Api.Tests.Contracts;

public class ValidationContractTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ValidationContractTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_ForInvalidEmail()
    {
        var request = new
        {
            fullName = "Jane Doe",
            email = "invalid-email",
            password = "SecurePassword123!",
            confirmPassword = "SecurePassword123!"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        payload.Should().NotBeNull();
        payload!.Success.Should().BeFalse();
        payload.Error!.Code.Should().Be("INVALID_INPUT");
        payload.Error.Details.Should().ContainSingle(detail => detail.Field == "Email" || detail.Field == "email");
    }
}
