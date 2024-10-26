import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:7234',
    headers: {"ngrok-skip-browser-warning": "true"}
});