import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import CardIndex from "./cards/cardIndex.jsx";
import {Link} from "react-router";

function Header() {
    const [data, setData] = useState({
        categories: [],
        headerPosts: [],
    });
    useEffect(() => {
        fetch("http://localhost:3010/header")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const categories = data.categories || [];
    const headerPosts = data.headerPosts || [];



    return (
        <header>
            <div className="topbar py-3">
                <div className="container-fluid px-lg-4">
                    <div className="row align-items-center g-3">
                        <div className="col-lg-2 col-md-12">
                            <Link className="logo-box" to={'/'}>News<span>Line</span></Link>
                            <div className="date-text mt-1">
                                {new Date().toLocaleDateString("en-GB").replaceAll("/", ".")} | Breaking News
                            </div>
                        </div>

                        <div className="col-lg-10">
                            <div className="row g-3">

                                {
                                    headerPosts.map((post) => (
                                        <div className="col-md-4" key={post.id}>
                                            <CardIndex value={post}  variant={'v3'}/>
                                        </div>

                                    ))
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand-lg navbar-dark main-nav py-0">
                <div className="container-fluid px-lg-4">

                    <button className="navbar-toggler my-2" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNav">
                        <ul className="navbar-nav me-auto">

                            <li className="nav-item">
                                <NavLink to="/"
                                      className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                >Home</NavLink>
                            </li>

                            {
                                categories.map((category) => {
                                    return (
                                        <li className="nav-item" key={category.id}>
                                        <NavLink to={`/catalog/${category.id}`}


                                                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}


                                        >{category.slug}</NavLink>
                                    </li>
                                    )
                                })
                            }

                        </ul>

                        <form className="d-flex py-2 py-lg-0">
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Search..."
                            />
                        </form>

                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;