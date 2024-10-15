namespace backend.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string Position { get; set; }
        public double Salary { get; set; }
        //foregin keys!!!!!!!
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
