using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PatientPortal.Domain.Entities;
using PatientPortal.Infrastructure;
using PatientPortal.Infrastructure.Repositories;
using Xunit;

namespace PatientPortal.Infrastructure.Tests;

public class UserRepositoryTests
{
    [Fact]
    public async Task GetByEmailAsync_ReturnsUser_WhenEmailExists()
    {
        var options = new DbContextOptionsBuilder<PatientPortalDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new PatientPortalDbContext(options);
        var user = new User
        {
            Email = "user@example.com",
            FirstName = "User",
            LastName = "Example",
            PasswordHash = "hash",
            Role = "Patient"
        };
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);
        var found = await repository.GetByEmailAsync("user@example.com");

        found.Should().NotBeNull();
        found!.Email.Should().Be("user@example.com");
    }
}
