using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Expense
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = "";

    [Required]
    [Column(TypeName = "decimal(18,2)")] // ✅ avoid warning about precision
    public decimal Amount { get; set; }

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    public string UserId { get; set; }
}
