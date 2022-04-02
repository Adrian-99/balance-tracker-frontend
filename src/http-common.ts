import properties from './properties.json';
import Axios from 'axios';

export default Axios.create({
    baseURL: properties.apiContext,
    headers: {
        "Content-Type": "application/json"
    }
});