using PatientPortal.Domain.Entities;

namespace PatientPortal.Infrastructure.Data;

public static class SeedData
{
    public static List<User> GetUsers()
    {
        return new List<User>
        {
            new User
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@patient-portal.com",
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("Admin@123"),
                Role = "Admin",
                IsActive = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "system",
                RefreshToken = null,
                RefreshTokenExpiresOn = null
            },
            new User
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                FirstName = "Doctor",
                LastName = "Smith",
                Email = "doctor.smith@patient-portal.com",
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("Doctor@123"),
                Role = "Doctor",
                IsActive = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "system",
                RefreshToken = null,
                RefreshTokenExpiresOn = null
            },
            new User
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                FirstName = "Jane",
                LastName = "Patient",
                Email = "jane.patient@patient-portal.com",
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("Patient@123"),
                Role = "Patient",
                IsActive = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "system",
                RefreshToken = null,
                RefreshTokenExpiresOn = null
            },
            new User
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                FirstName = "John",
                LastName = "Patient",
                Email = "john.patient@patient-portal.com",
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("Patient@456"),
                Role = "Patient",
                IsActive = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "system",
                RefreshToken = null,
                RefreshTokenExpiresOn = null
            },
            new User
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                FirstName = "Nurse",
                LastName = "Johnson",
                Email = "nurse.johnson@patient-portal.com",
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("Nurse@123"),
                Role = "Nurse",
                IsActive = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "system",
                RefreshToken = null,
                RefreshTokenExpiresOn = null
            }
        };
    }
}
