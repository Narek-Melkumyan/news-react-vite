import CardIndex from "./cards/cardIndex.jsx";
import { useEffect, useState } from "react";
import {Link} from "react-router";

function Videos() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3010/videos")
            .then(res => res.json())
            .then(data => {
                setVideos(data);
            })
            .catch(err => console.log(err));
    }, []);

    if (videos.length === 0) {
        return <div>Loading...</div>;
    }

    const mainVideo = videos[0];

    return (
        <section className="mb-5">
            <div className="row g-4">
                <div className="col-lg-3">
                    <aside className="sidebar-box h-100">
                        <div className="sidebar-header">Videos</div>

                        <div className="sidebar-list">
                            {videos.map((video) => (
                                <div
                                    key={video.id}
                                    style={{ cursor: "pointer" }}
                                >
                                    <CardIndex
                                        value={video}
                                        variant="v4"
                                    />
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                <Link to={`/video/${mainVideo.id}`} className="col-lg-9">
                    <h2 className="section-title">Video</h2>

                    <div className="video-cover">
                        <img
                            src={mainVideo.image}
                            alt={mainVideo.title}
                        />

                        <div className="play-btn">
                            <span>▶</span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}

export default Videos;