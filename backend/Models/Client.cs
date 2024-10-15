namespace backend.Models
{
    public class Client
    {
        public int ClientId { get; set; }
        public double Wallet {  get; set; }
        
        //foregin keys!!!!!!!  '?' - optional
        public int? AddressId { get; set; }
        public Address? Address { get; set; }
        
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
