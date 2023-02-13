using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Models
{
    public record AccountViewModel
    {
        [Required]
        public string UserName { get; init; }
        [Required]
        public string Password { get; init; }
        public string ReturnUrl { get; set; }
    }
}
