using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Exceptions
{
    public class Error
    {
        public string Message { get; set; }
        public string Code { get; set; }

        public Error(string message, string code)
        {
            Message = message;
            Code = code;
        }
    }
}
