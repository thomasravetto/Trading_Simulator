import GoogleLogo from '../../google.png';
import FacebookLogo from '../../facebook.png';

function LoginForm () {
    return (
        <div className='form_container'>
            <div className="shape1"></div>
            <div className="shape2"></div>
            <form className='login_form'>
                <h2>Login</h2>

                <div className='input_container'>
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Email" id="email"></input>
                </div>

                <div className='input_container'>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password"></input>
                </div>

                <button>Log In</button>
                <p className='alternatives_p'>or Sign Up using</p>
                <div className="social">
                    <img className="go" src={GoogleLogo} alt='google logo'></img>
                    <img className="fb" src={FacebookLogo} alt='facebook logo'></img>
                </div>

                <p className="redirect_auth">Don't have an account? <a href="/auth/register">Register</a></p>
            </form>
        </div>
    )
}

export default LoginForm;