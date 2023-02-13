using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Exceptions.GeneralExceptions
{
    public class EmptyStringException : Exception
    {
        public EmptyStringException(string message) : base(message) { }
    }
}
