using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Dto;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;
        public UserController(UserManager<AppUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;

        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // Retrieve all users from the database
            var users = await _userManager.Users.ToListAsync();

            if (users == null || !users.Any())
            {
                // Returning NotFound if no users are found
                return NotFound("No users found.");
            }

            // Map the users to the UserResponseDto
            var userResponseDtos = users.Select(user => new UserResponseDto
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = user.FullName
            }).ToList();

            return Ok(userResponseDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        [HttpPost("signup")]
        public async Task<ActionResult> CreateUser([FromBody] RegisterDto registerDto)
        {
            var ExistingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (ExistingUser != null)
            {
                return BadRequest("User already exixt");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var user = new AppUser
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (result == null)
            {
                return BadRequest("User not created");
            }
            var newUser = new RegisterResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                createdAt = user.CreatedAt.ToString()
            };
            return Ok(newUser);

        }



        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return BadRequest("User does not exist");
            }
            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!passwordValid)
            {
                return BadRequest("Invalid credentials");
            }
            var token = TokenGenerator(user);
            var res = new LoginResponse
            {
                Message = "Logged successful",
                IsSuccess = true,
                Token = token,
            };
            return Ok(res);
        }

        private string TokenGenerator(AppUser user)
        {
            var jwtConfig = _config.GetSection("jwtSettings");
            var newClaim = new[]
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName!),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["SecurityKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
            issuer: jwtConfig["Issuer"],
            audience: jwtConfig["Audience"],
            claims: newClaim,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
    );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}