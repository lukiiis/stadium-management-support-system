import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8081', // change port
    headers: {"ngrok-skip-browser-warning": "true"}
});