using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Dtos
{
    public class UserDto
    {
        public Guid Id;
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
