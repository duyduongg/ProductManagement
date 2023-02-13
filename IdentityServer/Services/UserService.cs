using IdentityServer.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Services
{
    public class UserService : IUserService
    {
        public Task<UserDto> GetUserById(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
