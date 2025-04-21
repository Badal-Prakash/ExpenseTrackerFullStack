using System.Globalization;
using Backend.Database;
using Backend.Dto;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ExpenseController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            var results = await _context.Expenses.ToListAsync();
            int Count = results.Count();
            var res = new
            {
                Count,
                results
            };
            return Ok(res);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpensesById(int id)
        {
            var res = await _context.Expenses.FindAsync(id);
            if (res == null)
            {
                return BadRequest();
            }
            var result = new Expense
            {
                Id = res.Id,
                UserId = res.UserId,
                Amount = res.Amount,
                Title = res.Title,
                Category = res.Category,
                Date = res.Date
            };
            return Ok(result);
        }


        [HttpPost]
        public async Task<ActionResult> CreateExpense([FromBody] ExpenseDto expenseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("expense type is not valid");
            }
            if (expenseDto.UserId is null)
            {
                return BadRequest("userId not found");
            }
            var expense = new Expense
            {
                Title = expenseDto.Title,
                Amount = expenseDto.Amount,
                Category = expenseDto.Category,
                Date = expenseDto.Date,
                UserId = expenseDto.UserId
            };
            var results = await _context.Expenses.AddAsync(expense);
            if (results.State == EntityState.Added)
            {
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
            }
            return BadRequest("failed in adding expense");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditExpense(int id, [FromBody] ExpenseDto expenseDto)
        {

            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound("Expense not Found");
            }
            expense.Title = expenseDto.Title;
            expense.Amount = expenseDto.Amount;
            expense.Category = expenseDto.Category;
            expense.Date = expenseDto.Date;

            await _context.SaveChangesAsync();
            return Ok(expense);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return BadRequest();
            }
            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }



        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetTaskByUser(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Await the ToListAsync() method to get the actual data
            var expenses = await _context.Expenses.Where(e => e.UserId == userId).ToListAsync();

            // Return the data inside Ok() response
            return Ok(expenses);
        }

        [HttpGet("recent/{userId}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetRecentExpensesByUser(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.Date)
                .Take(5)
                .ToListAsync();

            return Ok(expenses);
        }

        [HttpGet("{userId}/{filterType}")]
        public async Task<IActionResult> GetFilteredExpenses(string userId, string filterType)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var filtered = filterType switch
            {
                "daily" => expenses
                    .GroupBy(e => e.Date.Date)
                    .Select(g => new { label = g.Key.ToString("dd MMM"), total = g.Sum(e => e.Amount) }),

                "weekly" => expenses
                    .GroupBy(e => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(e.Date, CalendarWeekRule.FirstDay, DayOfWeek.Monday))
                    .Select(g => new { label = "Week " + g.Key, total = g.Sum(e => e.Amount) }),

                "monthly" => expenses
                    .GroupBy(e => new { e.Date.Month, e.Date.Year })
                    .Select(g => new { label = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}", total = g.Sum(e => e.Amount) }),

                "yearly" => expenses
                    .GroupBy(e => e.Date.Year)
                    .Select(g => new { label = g.Key.ToString(), total = g.Sum(e => e.Amount) }),

                _ => null
            };

            return Ok(filtered);
        }



    }
}