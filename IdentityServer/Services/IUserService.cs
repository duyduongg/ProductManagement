using IdentityServer.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUserById(Guid id);
    }
}
