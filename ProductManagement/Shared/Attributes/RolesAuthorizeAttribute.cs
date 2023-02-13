using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Shared.Attributes
{
    public class RolesAuthorizeAttribute : AuthorizeAttribute
    {
        public RolesAuthorizeAttribute(params string[] roles) : base()
        {
            if(roles?.Any() == true)
            {
                Roles = string.Join(",", roles);
            }
        }
    }
}
