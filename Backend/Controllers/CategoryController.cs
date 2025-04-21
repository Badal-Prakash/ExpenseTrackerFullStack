using Backend.Database;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategoryController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            if (category == null || string.IsNullOrEmpty(category.Name) || string.IsNullOrEmpty(category.UserId))
                return BadRequest("Invalid category data");

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCategoriesByUser(string userId)
        {
            var categories = await _context.Categories
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(categories);
        }
    }
}
