using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos.ApiDtos
{
    public class DataSourceRequestFilterDto<T>
    {
        public DataSourceRequestDto DataSourceRequest { get; set; } = new DataSourceRequestDto();
        public T Filter { get; set; }
    }
}
