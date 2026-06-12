using AutoMapper;
using Core.Common.Mappings;
using Core.Entities;
using Core.Enums;

namespace Core.DTOs.Responses;

public class UserDto : IMapFrom<User>
{
    public int Id { get; init; }
    public string UserName { get; init; }
    public string FullName { get; init; }
    public string? Email { get; init; }
    public string? PhoneNumber { get; init; }
    public int Type { get; init; }
    public string? AvatarId { get; init; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, UserDto>()
            .ForMember(dest => dest.FullName, opt =>
                opt.MapFrom(src => $"{src.LastName} {src.FirstName}"));
    }
}

public class GetMeUserDto 
{
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string? PhoneNumner { get; set; }
    public string? Email { get; set; }
    public EUserType Type { get; set; }
}

public class UserByDepartment : IMapFrom<UserSync>
{
    public int Id { get; init; }
    public string UserName { get; init; }
    public string FullName { get; init; }
    public string DepartmentName { get; init; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<UserSync, UserByDepartment>()
            .ForMember(dest => dest.FullName, opt =>
                opt.MapFrom(src => $"{src.LastName} {src.FirstName}"));
    }
}