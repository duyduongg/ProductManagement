using Microsoft.AspNetCore.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Services
{
    public interface ILoginService<T>
    {
        bool ValidateCredentials(T user, string password);
        Task<T> FindByUserName(string userName);
        Task Login(T user);
        Task LoginAsync(T user, AuthenticationProperties props, string authenticationMethod = null);
        Task LogoutAsync();
    }
}
