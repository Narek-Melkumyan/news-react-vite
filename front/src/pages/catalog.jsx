import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CardIndex from "../components/cards/cardIndex.jsx";

function Catalog() {
    const { id } = useParams();

    const [articles, setArticles] = useState([]);
    const [feedPosts, setFeedPosts] = useState([]);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3010/getAllArticlesById/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setCategory(data.category);
                setArticles(data.articles || []);
                setFeedPosts(data.feedPosts || []);
            })
            .catch((error) => console.log(error))

    }, [id]);



    return (
        <main className="catalog-page py-4">
            <div className="container">
                <div className="catalog-header mb-4">
                    <div>
                        <h2 className="section-title mb-1">
                            {category?.name}
                        </h2>

                        <p className="catalog-subtitle">
                            {category?.description}
                        </p>
                    </div>

                    <span className="catalog-count">
                        {articles.length} articles
                    </span>
                </div>

                <div className="row g-4">
                    <div className="col-lg-9">
                        {articles.length === 0 ? (
                            <div className="empty-category">
                                <h4>No articles found</h4>
                                <p>There are no published articles in this category yet.</p>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {articles.map((article) => (
                                    <div className="col-12 col-xl-3 col-lg-4 col-md-4 col-sm-6" key={article.id}>
                                        <CardIndex
                                            value={article}
                                            variant="v1"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-lg-3">
                        <aside className="sidebar-box sticky-sidebar">
                            <div className="sidebar-header">
                                Latest News
                            </div>

                            <div className="sidebar-list">
                                {feedPosts.map((value) => (
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

export default Catalog;