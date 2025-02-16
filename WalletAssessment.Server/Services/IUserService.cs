using WalletAssessment.Server.Data.Contracts;

namespace WalletAssessment.Server.Services
{
    public interface IUserServices
    {


        Task<UserResponse> RegisterAsync(UserRegisterRequest request);
        Task<CurrentUserResponse> GetCurrentUserAsync();
        Task<UserResponse> GetByIdAsync(Guid id);
        Task<UserResponse> UpdateAsync(Guid id, UpdateUserRequest request);
        Task DeleteAsync(Guid id);
        Task<CurrentUserResponse> RefreshTokenAsync(RefreshTokenRequest request);

        Task<UserResponse> LoginAsync(UserLoginRequest request);
    }
}
