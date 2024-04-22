using Core.Interfaces.Repository;
using Core.ViewModels;
using Infrastructure.ManagementContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UserRepository : IUserRepo
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserRepository( UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {   
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task AddRoleToUser(string role, string userId)
        {

            if (!await _roleManager.RoleExistsAsync(role))
            {
                
                return;
            }
            var user = await _userManager.FindByIdAsync(userId);
            await _userManager.AddToRoleAsync(user, role);
        }

        public async Task Delete(IdentityUser obj)
        {
            await _userManager.DeleteAsync(obj);
        }

        public async Task<IEnumerable<IdentityUser>> GetAllusers()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<IdentityUser> GetById(string id)
        {
            return await _userManager.FindByIdAsync(id);
        } 

        public async Task<IdentityUser> GetByUsername(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public string HashPassword(IdentityUser user, string password)
        {
            return _userManager.PasswordHasher.HashPassword(user, password);
        }

        public async Task Insert(IdentityUser obj)
        {
            await _userManager.CreateAsync(obj);
        }

        public async Task Update(IdentityUser Obj)
        {
            try
            {
                await _userManager.UpdateAsync(Obj);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while updating the user: {ex.Message}");
            }
        }
    }
}
