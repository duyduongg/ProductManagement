using IdentityModel;
using IdentityServer.Models;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IdentityServer.Services
{
    public class ProfileService : IProfileService
    {
        private readonly UserManager<User> _userManager;

        public ProfileService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var subject = context.Subject ?? throw new ArgumentNullException(nameof(context.Subject));

            var subjectId = subject.Claims.FirstOrDefault(c => c.Type == "sub").Value;

            var user = await _userManager.FindByIdAsync(subjectId);
            if(user == null)
            {
                throw new ArgumentException("Invalid subject identifier");
            }

            var claims = GetClaimsFromUser(user);
            context.IssuedClaims = claims.ToList();
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var subject = context.Subject ?? throw new ArgumentNullException(nameof(context.Subject));

            var subjectId = subject.Claims.FirstOrDefault(c => c.Type == "sub").Value;
            var user = await _userManager.FindByIdAsync(subjectId);

            context.IsActive = false;

            if(user != null)
            {
                if(_userManager.SupportsUserSecurityStamp)
                {
                    var securityStamp = subject.Claims.Where(c => c.Type == "security_stamp").Select(c => c.Value).SingleOrDefault();
                    if(securityStamp != null)
                    {
                        var dbSecurityStamp = await _userManager.GetSecurityStampAsync(user);
                        if(dbSecurityStamp != securityStamp)
                        {
                            return;
                        }
                    }
                }

                context.IsActive = !user.LockoutEnabled || !user.LockoutEnd.HasValue || user.LockoutEnd <= DateTime.Now;
            }
        }

        public IEnumerable<Claim> GetClaimsFromUser(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtClaimTypes.Subject, user.Id),
                new Claim(JwtClaimTypes.PreferredUserName, user.UserName),
                new Claim(JwtClaimTypes.Name, user.FullName),
                new Claim(JwtClaimTypes.Email, user.Email)
            };

            var resultUser = _userManager.FindByIdAsync(user.Id).Result;
            var userRoles = _userManager.GetRolesAsync(resultUser).Result;

            claims.AddRange(userRoles.Select(r => new Claim(JwtClaimTypes.Role, r)));

            return claims;
        }
    }
}
