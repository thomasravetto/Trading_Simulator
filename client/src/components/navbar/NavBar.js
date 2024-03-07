import Logo from '../../logo.png'

function NavBar () {
    return (
        <div className='navbar_container'>
            <a href='/'><img className='navbar_logo' src={Logo} alt='app logo'/></a>
            <div className='navbar_links_container'>
                <a href='/'><p className='navbar_link'>Dashboard</p></a>
                <a href='/market'><p className='navbar_link'>Market</p></a>
                <a href='/about'><p className='navbar_link'>About</p></a>
                <a href='/'><p className='navbar_link'>Profile</p></a>
            </div>
        </div>
    )
}

export default NavBar;