import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GoogleLogo from '../../google.png';
import GithubLogo from '../../github.png';

function RegisterForm (props) {

    const API_URL = props.API_URL;

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function onUsernameChange (event) {
        setUsername(event.target.value);
    }

    function onEmailChange (event) {
        setEmail(event.target.value);
    }

    function onPasswordChange (event) {
        setPassword(event.target.value);
    }

    async function submitRegister (event) {
        event.preventDefault();

        if (!validateEmail(email)) {
            return;
        }

        const resp = await fetch(API_URL + '/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await resp.json();

        if (data.username) {
            props.loadUser(data, () => {
                navigate('/');
            });
        } else if (data.error) {
            setUsername('');
            setEmail('');
            setPassword('');
        } else {
            console.error(data);
        }
    }

    function validateEmail (email) {
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isEmailValid = emailPattern.test(email);

        if (isEmailValid) {
            // setLoginError('');
            return true;
        } else {
            // setLoginError('The Email format is invalid');
            return false;
        }
    }

    return (
        <div className='form_container'>
            <div className="shape1"></div>
            <div className="shape2"></div>
            <form className='registration_form'>
                <h2>Register</h2>

                <div className='input_container'>
                    <label htmlFor="username">Username</label>
                    <input onChange={onUsernameChange} type="text" placeholder="Username" id="username"></input>
                </div>

                <div className='input_container'>
                    <label htmlFor="email">Email</label>
                    <input onChange={onEmailChange} type="email" placeholder="Email" id="email"></input>
                </div>

                <div className='input_container'>
                    <label htmlFor="password">Password</label>
                    <input onChange={onPasswordChange} type="password" placeholder="Password" id="password"></input>
                </div>

                <button onClick={submitRegister}>Register</button>
                <p className='alternatives_p'>or Register using</p>
                <div className="social">
                    <a href='https://google.com'><img className="go" src={GoogleLogo} alt='google logo'></img></a>
                    <a href='https://github.com'><img className="gh" src={GithubLogo} alt='github logo'></img></a>
                </div>

                <p className="redirect_auth">Already have an account? <a href="/auth/login">Log In</a></p>
            </form>
        </div>
    )
}

export default RegisterForm;