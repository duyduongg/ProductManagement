using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos.ApiDtos
{
    public class DataSourceRequestDto
    {
        public int Take { get; set; } = 10;
        public int Skip { get; set; } = 0;
        public ICollection<SortFieldDto> Sorts { get; set; } = new List<SortFieldDto>();
    }
}
