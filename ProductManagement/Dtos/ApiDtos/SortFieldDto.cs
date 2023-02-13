using ProductManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos.ApiDtos
{
    public class SortFieldDto
    {
        public string Field { get; set; }
        public SortOrder Order { get; set; }
    }
}
