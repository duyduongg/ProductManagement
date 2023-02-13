using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Configuration
{
    public class AppSettings
    {
        public string ConnectionString { get; set; }
        public string ProductUiUrl { get; set; }
        public int TokenLifeTimeMinute { get; set; } = 120;
    }
}
