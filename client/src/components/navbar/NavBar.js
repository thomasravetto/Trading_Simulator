import Logo from '../../logo.png'

function NavBar () {
    return (
        <div className='navbar_container'>
            <img className='navbar_logo' src={Logo} alt='app logo'/>
            <div className='navbar_links_container'>
                <a><p className='navbar_link'>Dashboard</p></a>
                <a><p className='navbar_link'>Market</p></a>
                <a><p className='navbar_link'>About</p></a>
                <a><p className='navbar_link'>Profile</p></a>
            </div>
        </div>
    )
}

export default NavBar;