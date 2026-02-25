import axios from 'axios';

export default async function SignIn(userData) {
    try {
        const { data } = await axios.post('https://route-posts.routemisr.com/users/signin', userData , {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data;
    } catch (error) {
        return error.response?.data
    }
}