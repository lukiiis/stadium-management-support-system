namespace backend.Models
{
    public class Admin
    {
        public int AdminId { get; set; }
        public string Seniority { get; set; }
        public double Salary { get; set; }
        //foregin keys!!!!!!!
        public User User { get; set; }
    }
}
