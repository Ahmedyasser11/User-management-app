using Core.Models;
using Core.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace Core.Interfaces.Service
{
    public interface IAuthService
    {
        Task<Response<IEnumerable<Claim>>> login(LoginModel model);
        Task<Response<IEnumerable<Claim>>> Register(FormViewModel user);
        Task<List<Claim>> GetUserClaims(IdentityUser userInfo);
        public string GenerateAccessToken(IEnumerable<Claim> claims);

    }
}
