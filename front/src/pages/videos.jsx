import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CardIndex from "../components/cards/cardIndex.jsx";

function Videos() {
    const {id} = useParams();
    const [video, setVideo] = useState(null);
    const [feedPost, setFeedPost] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:3010/getVideo/${id}`).then(res => res.json()).then((data) => {
            setVideo(data.video);
            setFeedPost(data.feedPosts);
        })
    }, [id]);
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;

        let videoId = "";

        if (url.includes("watch?v=")) {
            videoId = url.split("watch?v=")[1].split("&")[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0];
        } else if (url.includes("/embed/")) {
            return url;
        }

        if (!videoId) return null;

        return `https://www.youtube.com/embed/${videoId}`;
    };


    if (!video) {
        return <h2>Loading...</h2>;
    }

    const embedUrl = getYoutubeEmbedUrl(video.video_url);

    return (
        <main className="article-details py-4">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-9">
                        <article className="article-box">
                            <div className="video-cover">
                                {embedUrl && (
                                    <iframe
                                        width="100%"
                                        height="420"
                                        src={embedUrl}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>

                            <div className="article-meta mt-3">
                                {new Date(video.created_at).toLocaleDateString()}
                            </div>

                            <h1 className="article-title">
                                {video.title}
                            </h1>
                        </article>
                    </div>

                    <div className="col-lg-3">
                        <aside className="sidebar-box">
                            <div className="sidebar-header">Latest Videos</div>

                            <div className="sidebar-list">
                                {feedPost.map((value) => (
                                    <CardIndex
                                        key={value.id}
                                        value={value}
                                        variant="v3"
                                    />
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Videos;

