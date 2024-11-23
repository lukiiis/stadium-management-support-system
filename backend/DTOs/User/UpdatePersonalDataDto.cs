namespace backend.DTOs.User
{
    public class UpdatePersonalDataDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public int Phone { get; set; }
        public string Email { get; set; }
    }
}
