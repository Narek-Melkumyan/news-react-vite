import CardIndex from "./cards/cardIndex.jsx";
import {useEffect, useState} from "react";

function MostRead() {

    const [homeData, setHomeData] = useState({
        mostViewedPosts: [],
        feedPosts: [],
    });

    useEffect(() => {
        fetch("http://localhost:3010/home-posts")
            .then((res) => res.json())
            .then((data) => {
                setHomeData({
                    mostViewedPosts: data.mostViewed,
                    feedPosts: data.feedPosts,
                });
            })
            .catch((err) => console.log(err));
    }, []);

    const mostViewedPosts = homeData?.mostViewedPosts || [];
    const feedPosts = homeData?.feedPosts || [];

    return (
        <section className="mb-5">
            <div className="row g-4">
                <div className="col-lg-9">
                    <h2 className="section-title">Most read</h2>
                    <div className="row g-4">
                    {mostViewedPosts.map((post) => (
                    <div className="col-md-4" key={post.id}>
                            <CardIndex value={post} key={post.id} variant={"v2"} />
                    </div>
                    ))}
                    </div>
                </div>
                <div className="col-lg-3">
                    <aside className="sidebar-box">
                        <div className="sidebar-header">Latest News</div>
                        <div className="sidebar-list">
                            {feedPosts.map((post) => (
                                <CardIndex value={post} key={post.id} variant={"v3"} />
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default MostRead;