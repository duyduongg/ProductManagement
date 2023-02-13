using IdentityServer.Configuration;
using IdentityServer.Models;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductManagement.Shared.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer.Data
{
    public static class DataSeed
    {
        public static List<IdentityRole> IdentityRoles = new List<IdentityRole>()
        {
            new IdentityRole()
            {
                Name = Roles.Admin,
                NormalizedName = Roles.Admin
            },
            new IdentityRole()
            {
                Name = Roles.Manager,
                NormalizedName = Roles.Manager
            },
            new IdentityRole()
            {
                Name = Roles.Employee,
                NormalizedName = Roles.Employee
            }
        };

        public static Dictionary<string, List<User>> Users = new Dictionary<string, List<User>>()
        {
            { Roles.Admin, new List<User>()
                {
                    new User()
                    {
                        FullName = "John Doe",
                        UserName = "johndoe123",
                        Email = "johndoe@gmail.com",
                        PasswordHash = "admin123"
                    }
                }
            },
            {
                Roles.Manager, new List<User>()
                {
                    new User()
                    {
                        FullName = "Cors Smith",
                        UserName = "corssmith123",
                        Email = "corssmite@gmail.com",
                        PasswordHash = "manager123"
                    }
                }
            },
            {
                Roles.Employee, new List<User>()
                {
                    new User()
                    {
                        FullName = "Notting Madder",
                        UserName = "nottingmadder123",
                        Email = "nottingmadder@gmail.com",
                        PasswordHash = "empl123"
                    }
                }
            }
        };

        public static async Task SeedRole(this UserDbContext context)
        {
            if (!await context.Roles.AnyAsync(r => r.Name != null))
            {
                var roleStore = new RoleStore<IdentityRole>(context);
                foreach (var role in IdentityRoles)
                {
                    await roleStore.CreateAsync(role);
                }
            }
        }

        public static async Task SeedUsersAndAssignRole(
            this UserDbContext context,
            UserStore<User> userStore,
            List<User> users,
            string role)
        {
            var resultUsers = await context.Users.ToListAsync();
            foreach (var user in users)
            {
                if (!resultUsers.Exists(u => u.UserName == user.UserName))
                {
                    await userStore.AddToRoleAsync(user, role);
                    await userStore.CreateAsync(user);
                }
                else
                {
                    var userRole = (List<User>)await userStore.GetUsersInRoleAsync(role);
                    if (userRole.Find(u => u.UserName == user.UserName) == null)
                    {
                        int index = resultUsers.FindIndex(u => u.UserName == user.UserName);
                        await userStore.AddToRoleAsync(resultUsers[index], role);
                    }
                }
            }
        }

        public static async Task SeedData(this UserDbContext context)
        {
            var userStore = new UserStore<User>(context);
            using (var transaction = context.Database.BeginTransaction())
            {
                await SeedRole(context);
                foreach (var entry in Users)
                {
                    await SeedUsersAndAssignRole(context, userStore, entry.Value, entry.Key);
                }
                await context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
        }

        public static async Task SeedConfiguration(this ConfigurationDbContext context, AppSettings settings)
        {
            var clientUrls = new Dictionary<string, string>
            {
                { "product", settings.ProductUiUrl }
            };

            if(!await context.Clients.AnyAsync())
            {
                foreach(var client in IdentityServerConfig.GetClients(clientUrls))
                {
                    context.Clients.Add(client.ToEntity());
                }
            }

            if(!await context.ApiResources.AnyAsync())
            {
                foreach(var api in IdentityServerConfig.GetApis())
                {
                    context.ApiResources.Add(api.ToEntity());
                }
            }

            if(!await context.IdentityResources.AnyAsync())
            {
                foreach(var resource in IdentityServerConfig.GetResources())
                {
                    context.IdentityResources.Add(resource.ToEntity());
                }
            }

            if(!await context.ApiScopes.AnyAsync())
            {
                foreach(var scope in IdentityServerConfig.GetApiScopes())
                {
                    context.ApiScopes.Add(scope.ToEntity());
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
