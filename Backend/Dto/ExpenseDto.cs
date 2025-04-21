using System;
using Backend.Models;

namespace Backend.Dto;

public class ExpenseDto
{

    public int Id { get; set; }
    public string Title { get; set; }
    public decimal Amount { get; set; }
    public string Category { get; set; }
    public DateTime Date { get; set; }
    public string UserId { get; set; }
}

