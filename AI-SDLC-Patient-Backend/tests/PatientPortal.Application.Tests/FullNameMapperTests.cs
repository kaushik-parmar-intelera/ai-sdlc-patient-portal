using FluentAssertions;
using PatientPortal.Application.Mappers;
using Xunit;

namespace PatientPortal.Application.Tests;

public class FullNameMapperTests
{
    [Theory]
    [InlineData("Jane Doe", "Jane", "Doe")]
    [InlineData("Cher", "Cher", "")]
    [InlineData(" Marcus Aurelius ", "Marcus", "Aurelius")]
    public void Split_ReturnsExpectedParts(string fullName, string expectedFirstName, string expectedLastName)
    {
        var result = FullNameMapper.Split(fullName);

        result.firstName.Should().Be(expectedFirstName);
        result.lastName.Should().Be(expectedLastName);
    }
}
