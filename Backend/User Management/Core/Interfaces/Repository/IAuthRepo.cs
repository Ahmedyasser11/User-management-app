using Core.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace Core.Interfaces.Repository
{
    public interface IAuthRepo
    {
        Task<IdentityUser> ValidateCredentialsAsync(string username, string password);
        Task<IdentityUser> RegisterAsync(FormViewModel user);
        Task<IEnumerable<string>> GetRolesAync(IdentityUser user);
        Task<bool> isExist(string username);
    }
}
