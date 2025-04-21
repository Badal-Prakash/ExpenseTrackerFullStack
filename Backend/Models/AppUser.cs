using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppUser : IdentityUser
{
    public string? FullName { get; set; }

    public DateOnly CreatedAt { get; set; } = DateOnly.FromDateTime(DateTime.Now);

}
