namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public int Phone { get; set; }
        public string Email {  get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
    
        //foreign keys
        public Client Client { get; set; }
        public Admin Admin { get; set; }
        public Employee Employee { get; set; }
    }
}
