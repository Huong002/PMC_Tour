namespace Core.Exceptions;

public class ValidationCustomException : Exception
{
    public string FieldName { get; set; }
    public string ErrorMessage { get; set; }

    public ValidationCustomException(string fieldName, string errorMessage)
        : base($"{errorMessage}")
    {
        FieldName = fieldName;
        ErrorMessage = errorMessage;
    }

    // Có thể cung cấp thêm các constructor nếu cần
    public ValidationCustomException(string fieldName, string errorMessage, Exception innerException)
        : base($"{errorMessage}", innerException)
    {
        FieldName = fieldName;
        ErrorMessage = errorMessage;
    }
}