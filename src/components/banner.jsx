import './banner.css';
import NavBar from './navigation.jsx';

function banner() {
    return (
        <>
            <div className="banner">
                <header className="bg-black p-30 text-center">
                    <h1 className="text-[48px] font-bold text-white">Welcome to NovaMart!</h1>
                </header>
                <NavBar />
            </div>
        </>
    );
}

export default banner;