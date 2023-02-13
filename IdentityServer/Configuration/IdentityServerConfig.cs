using IdentityServer.Constants;
using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;

namespace IdentityServer.Configuration
{
    public static class IdentityServerConfig
    {
        public static IEnumerable<ApiResource> GetApis()
        {
            return new List<ApiResource>
            {
                new ApiResource
                {
                    Name = "product",
                    Description = "Product Service",
                    Enabled = true,
                    DisplayName = "Product API",
                    Scopes = new List<string> { "product" }
                }
            };
        }

        public static IEnumerable<IdentityResource> GetResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
        }

        // Define API resources that are protected by IdentityServer4
        public static IEnumerable<ApiScope> GetApiScopes()
        {
            return new[]
            {
                new ApiScope("product", "Product API")
            };
        }

        // Define client application that will use protected API resources
        public static IEnumerable<Client> GetClients(
            Dictionary<string, string> clientUrls)
        {
            return new List<Client>
            {
                new Client
                {
                    ClientId = "pm-frontend",
                    ClientName = "PmFrontend",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    RequirePkce = true,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    RequireClientSecret = false,
                    RequireConsent = false,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = {clientUrls["product"]},
                    PostLogoutRedirectUris = {"http://localhost:5000/.sqlwell-known/openid-configuration"},
                    AllowedCorsOrigins = {clientUrls["product"]},
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "product"
                    }
                }
            };
        }
    }
}
