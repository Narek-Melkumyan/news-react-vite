import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CardIndex from "../components/cards/cardIndex.jsx";

function Details() {
    const {slug}=useParams();
    const [article, setArticle] = useState(null);
    const [feedPosts, setFeedPosts] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:3010/getArticle/${slug}`).then(res => res.json()).then((data) => {
            setArticle(data.article);
            setFeedPosts(data.feedPosts);
        }).catch(error => console.log(error));
    }, [slug]);


    if (!article) {
        return <h2>Loading...</h2>;
    }


    return (
        <main className="article-details py-4">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-9">
                        <article className="article-box">
                            <img
                                className="article-image"
                                src={article.image}
                                alt={article.title}
                            />

                            <div className="article-meta">
                                {new Date(article.created_at).toLocaleDateString()}
                                {" "} | {" "}
                                {article.views} views
                            </div>

                            <h1 className="article-title">
                                {article.title}
                            </h1>

                            <p className="article-short">
                                {article.short_description}
                            </p>

                            <div
                                className="article-content"
                                dangerouslySetInnerHTML={{
                                    __html: article.content?.replaceAll("&nbsp;", " ")
                                }}
                            />
                        </article>
                    </div>

                    <div className="col-lg-3">
                        <aside className="sidebar-box">
                            <div className="sidebar-header">Latest News</div>

                            <div className="sidebar-list">
                                {feedPosts.map((post) => (
                                    <CardIndex
                                        value={post}
                                        key={post.id}
                                        variant="v3"
                                    />
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </main>)
}

export default Details;