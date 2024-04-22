using Core.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces.Repository
{
    public interface IUserRepo
    {
        Task<IdentityUser> GetById(string id);
        Task<IEnumerable<IdentityUser>> GetAllusers();
        Task Insert(IdentityUser obj);
        Task Update(IdentityUser Obj);
        Task Delete(IdentityUser id);
        Task AddRoleToUser(string role, string userId);
        Task<IdentityUser> GetByUsername(string username);
        string HashPassword (IdentityUser user, string password);
    }
}
