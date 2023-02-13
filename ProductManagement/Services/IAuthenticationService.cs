using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Services
{
    public interface IAuthenticationService
    {
        void SetUser(JwtSecurityToken token);
    }
}
