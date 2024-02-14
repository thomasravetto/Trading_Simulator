import GoogleLogo from '../../google.png';
import FacebookLogo from '../../facebook.png';

function RegisterForm () {
    return (
        <div className='form_container'>
            <div className="shape1"></div>
            <div className="shape2"></div>
            <form className='registration_form'>
                <h2>Register</h2>

                <div className='input_container'>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="Email or Phone" id="username"></input>
                </div>

                <div className='input_container'>
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Email" id="email"></input>
                </div>

                <div className='input_container'>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password"></input>
                </div>

                <button>Register</button>
                <p className='alternatives_p'>or Register using</p>
                <div className="social">
                    <a href='https://google.com'><img className="go" src={GoogleLogo} alt='google logo'></img></a>
                    <a href='https://facebook.com'><img className="fb" src={FacebookLogo} alt='facebook logo'></img></a>
                </div>

                <p className="redirect_auth">Already have an account? <a href="/auth/login">Log In</a></p>
            </form>
        </div>
    )
}

export default RegisterForm;