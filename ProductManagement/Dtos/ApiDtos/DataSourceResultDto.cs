using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos.ApiDtos
{
    public class DataSourceResultDto<T>
    {
        public int Total { get; set; }
        public ICollection<T> Data { get; set; } = new List<T>();
    }
}
