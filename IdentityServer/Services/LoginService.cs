using IdentityServer.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Services
{
    public class LoginService : ILoginService<User>
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        public LoginService(UserManager<User> userManager, SignInManager<User> signinManager)
        {
            _userManager = userManager;
            _signInManager = signinManager;
        }

        public async Task<User> FindByUserName(string userName)
        {
            return await _userManager.Users.SingleOrDefaultAsync(u => u.UserName == userName);
        }

        public  Task Login(User user)
        {
            return _signInManager.SignInAsync(user, true);
        }

        public async Task LoginAsync(User user, AuthenticationProperties props, string authenticationMethod = null)
        {
            await _signInManager.SignInAsync(user, props, authenticationMethod);
        }

        public bool ValidateCredentials(User user, string password)
        {
            // Password has not been hashes, check password manually
            return string.Compare(user.PasswordHash, password, StringComparison.Ordinal) == 0 ? true : false;

            //return _userManager.CheckPasswordAsync(user, password); 
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
