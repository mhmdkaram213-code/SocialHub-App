import axios from 'axios';

export default async function SignUp(userData) {
    try {
        const { data } = await axios.post('https://route-posts.routemisr.com/users/signup', userData , {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data;
    } catch (error) {
        return error.response?.data
    }
}
