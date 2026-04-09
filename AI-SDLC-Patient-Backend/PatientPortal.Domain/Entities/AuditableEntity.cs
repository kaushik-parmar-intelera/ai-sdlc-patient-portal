namespace PatientPortal.Domain.Entities;

public abstract class AuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = "system";
    public DateTime? ModifiedOn { get; set; }
    public string? ModifiedBy { get; set; }
}
