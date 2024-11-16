import ReservationsDay from "./components/daily/ReservationsDay";
import ReservationsWeek from "./components/weekly/ReservationsWeek";

const Reservation = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    console.log(formattedDate)
    return (
        <ReservationsWeek date="2024-11-18" objectId={1} />
    )
}
export default Reservation;