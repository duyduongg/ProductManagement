using IdentityModel;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        public List<string> Roles { get; set; } = new();
        public string UserName { get; set; } = "";
        public void SetUser(JwtSecurityToken token)
        {
            Roles = token.Claims
                .Where(c => c.Type == JwtClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();
            UserName = token.Claims
                .Where(c => c.Type == JwtClaimTypes.PreferredUserName)
                .Select(c => c.Value)
                .SingleOrDefault();
        }
    }
}
