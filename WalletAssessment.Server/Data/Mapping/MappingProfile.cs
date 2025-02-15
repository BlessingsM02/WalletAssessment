using WalletAssessment.Server.Data.Contracts;
using WalletAssessment.Server.Models;
using AutoMapper;

namespace WalletAssessment.Server.Data.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ApplicationUser, UserResponse>();
            CreateMap<ApplicationUser, CurrentUserResponse>();
            CreateMap<UserRegisterRequest, ApplicationUser>();

        }
    }
}
