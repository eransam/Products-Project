import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Logo from "../../HomeArea/Logo/Logo";
import "./Header.css";


function Header(): JSX.Element {
    return (
        <div className="Header">
            
            <Logo />
            <AuthMenu />
        </div>
    );
}

export default Header;

