import Header from "../../components/header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "../../components/footer.jsx";

function Main() {
    return (

            <div className="site-wrap">
                <Header />
                <Outlet/>
                <Footer/>
            </div>


    );
}

export default Main;