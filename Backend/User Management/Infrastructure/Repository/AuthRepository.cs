using Core.Interfaces.Repository;
using Core.ViewModels;
using Infrastructure.ManagementContext;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class AuthRepository : IAuthRepo
    {
        private readonly UserManager<IdentityUser> _userManager;
        public AuthRepository(ApplicationDbContext context, UserManager<IdentityUser> _userManager)
        {
            this._userManager = _userManager;
        }
        public async Task<IdentityUser> RegisterAsync(FormViewModel user)
        {
            if (!await isExist(user.Username))
            {
                IdentityUser NewUser = new()
                {
                    Email = user.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = user.Username,
                    PhoneNumber = user.PhoneNumber,
                };
                var result = await _userManager.CreateAsync(NewUser, user.Password);
                if (result.Succeeded)
                    return NewUser;
                else
                    return null;
            }
            return null;
        }

        public async Task<IdentityUser> ValidateCredentialsAsync(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user != null && await _userManager.CheckPasswordAsync(user, password))
            {
                return user;
            }
            return null;
        }

        public async Task<IEnumerable<string>> GetRolesAync(IdentityUser user) => await _userManager.GetRolesAsync(user);
        public async Task<bool> isExist(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return false;
            return true;
        }


    }
}
