using System;

namespace Backend.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
