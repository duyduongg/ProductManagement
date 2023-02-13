using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos
{
    public class UserDto : BaseDto
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
    }
}
