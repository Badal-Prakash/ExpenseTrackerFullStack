using System;

namespace Backend.Dto;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;

}
