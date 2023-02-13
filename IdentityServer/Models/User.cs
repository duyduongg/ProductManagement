using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Models
{
    public class User : IdentityUser
    {
        public User()
        {
            UserRoles = new HashSet<IdentityUserRole<string>>();
        }
        public string FullName { get; set; }
        public ICollection<IdentityUserRole<string>> UserRoles { get; set; }
    }
}
