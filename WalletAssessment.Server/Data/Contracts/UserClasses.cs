namespace WalletAssessment.Server.Data.Contracts
{
    public class UserClasses
    {
    }
    public class UserRegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

    }


    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreateAt { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }


    }

    public class UserLoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class CurrentUserResponse
    {

        public string Name { get; set; }
        public string Email { get; set; }
        public string AccessToken { get; set; }
        public DateTime CreateAt { get; set; }

    }


    public class UpdateUserRequest
    {
        public string Name { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }
    }


    public class RevokeRefreshTokenResponse
    {
        public string Message { get; set; }
    }


    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; }
    }

}
