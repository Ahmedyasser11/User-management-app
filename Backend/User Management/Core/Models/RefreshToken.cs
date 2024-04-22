using System;
using System.Collections.Generic;

namespace Core.Models;

public partial class RefreshToken
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string Token { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }
}
