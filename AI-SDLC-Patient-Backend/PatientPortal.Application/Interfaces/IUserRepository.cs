using PatientPortal.Domain.Entities;

namespace PatientPortal.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByRefreshTokenAsync(string refreshToken);
    Task<User?> GetByIdAsync(Guid id);
    Task AddAsync(User user);
    Task SaveChangesAsync();
}
