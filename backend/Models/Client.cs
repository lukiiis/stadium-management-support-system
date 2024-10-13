namespace backend.Models
{
    public class Client
    {
        public int ClientId { get; set; }
        public double Wallet {  get; set; }
        
        //foregin keys!!!!!!!
        public Address Address { get; set; }
        public User User { get; set; }
    }
}
