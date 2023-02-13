using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Extensions
{
    public static class TaskExtension
    {
        public static T RunAwait<T>(this Task<T> task)
        {
            return task == null ? default : task.ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public static void RunAwait(this Task task)
        {
            task?.ConfigureAwait(false).GetAwaiter().GetResult();
        }
    }
}
