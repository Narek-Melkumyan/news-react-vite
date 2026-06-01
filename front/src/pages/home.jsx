import {useEffect, useState} from "react";
import CardIndex from "../components/cards/cardIndex.jsx";
import MostRead from "../components/mostRead.jsx";
import HighlightsSection from "../components/highlightsSection.jsx";
import Quotes from "../components/quotes.jsx";
import Videos from "../components/videos.jsx";
import International from "../components/international.jsx";
import {Link} from "react-router";

function Home() {


    const [data, setData] = useState(null)

    useEffect(() => {
        fetch("http://localhost:3010/homePage")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err))
    }, [])

    const mainPost = data?.mostViewedPost || []
    const sidePosts = data?.otherPosts || []
    if (!mainPost || !sidePosts) {
        return <p>Loading...</p>
    }




    return (
        <main className="container-fluid px-lg-4 py-4">
            <section className="mb-5">

                <div className="row g-4">
                    <div className="col-lg-8">
                        <Link to={`/post/${mainPost.slug}`} href="#" className="hero-main d-block">
                            <img
                                src={mainPost.image}
                                alt="headline"/>
                            <div className="hero-overlay">
                                <div>
                                    <span className="hero-badge">Top Story</span>
                                    <h1 className="hero-title">
                                        {mainPost.title}
                                    </h1>
                                    <div className="hero-meta">
                                        {new Date(mainPost.created_at).toLocaleDateString()} • 3 min read
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-4">
                        <div className="row g-3">
                            {sidePosts.map((post, index) => (
                                <CardIndex value={post} variant={"v1"} key={index}/>
                            ))}
                            <div className="col-12">
                                <div className="live-box">
                                    <div className="live-top">
                                        <span>Live TV</span>
                                        <span>● Live Now</span>
                                    </div>
                                    <div className="live-body">
                                        Embed a YouTube Live stream or TV widget here
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <MostRead/>

            <HighlightsSection/>

            <Quotes/>

            <Videos/>

            <International/>
        </main>

    );
}

export default Home;