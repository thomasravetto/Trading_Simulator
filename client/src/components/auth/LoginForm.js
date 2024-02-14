import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GoogleLogo from '../../google.png';
import GithubLogo from '../../github.png';

function LoginForm (props) {

    const API_URL = props.API_URL;

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function onEmailChange (event) {
        setEmail(event.target.value);
    }

    function onPasswordChange (event) {
        setPassword(event.target.value);
    }

    async function submitLogin (event) {
        event.preventDefault();

        if (!validateEmail(email)) {
            return;
        }

        const resp = await fetch(API_URL + '/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
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
            <form className='login_form'>
                <h2>Login</h2>

                <div className='input_container'>
                    <label htmlFor="email">Email</label>
                    <input onChange={onEmailChange} type="email" placeholder="Email" id="email"></input>
                </div>

                <div className='input_container'>
                    <label htmlFor="password">Password</label>
                    <input onChange={onPasswordChange} type="password" placeholder="Password" id="password"></input>
                </div>

                <button onClick={submitLogin}>Log In</button>
                <p className='alternatives_p'>or Sign Up using</p>
                <div className="social">
                    <a href='https://google.com'><img className="go" src={GoogleLogo} alt='google logo'></img></a>
                    <a href='https://github.com'><img className="gh" src={GithubLogo} alt='github logo'></img></a>
                </div>

                <p className="redirect_auth">Don't have an account? <a href="/auth/register">Register</a></p>
            </form>
        </div>
    )
}

export default LoginForm;