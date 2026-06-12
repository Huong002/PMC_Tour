using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.EFConfigurations;

public class FaceIDRecognitionResultConfiguration : IEntityTypeConfiguration<FaceIDRecognitionResult>
{
    public void Configure(EntityTypeBuilder<FaceIDRecognitionResult> builder)
    {
        builder.ToTable("FaceIDRecognitionResults");
        builder.Property(fr => fr.PersonCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(fr => fr.Topic)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(fr => fr.PersonName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(fr => fr.RecordedTime)
            .IsRequired();

        builder.Property(fr => fr.RecognitionResultStatus)
            .IsRequired();
    }
}