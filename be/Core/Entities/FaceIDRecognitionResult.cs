using Core.Enums;
using Shared;

namespace Core.Entities;

public class FaceIDRecognitionResult : BaseAuditableEntity
{
    public string PersonCode { get; set; }
    public string Topic { get; set; }
    public string FaceCode { get; set; }
    public string PersonName { get; set; }
    public DateTime RecordedTime { get; set; }
    public ERecognitionResultStatus RecognitionResultStatus { get; set; }
}