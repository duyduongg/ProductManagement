using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos
{
    public class BaseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
