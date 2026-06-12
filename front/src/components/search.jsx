import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function Search() {
    const [searchText, setSearchText] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const value = searchText.trim();

        if (value.length < 2) {
            setArticles([]);
            setError("");
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);
            setError("");

            fetch(
                `http://localhost:3010/search?q=${encodeURIComponent(value)}`
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Search failed");
                    }

                    return response.json();
                })
                .then((result) => {
                    setArticles(result.articles || []);
                })
                .catch((error) => {
                    setError(error.message);
                    setArticles([]);
                })
                .finally(() => {
                    setLoading(false);
                });

        }, 400);

        return () => {
            clearTimeout(timeout);
        };

    }, [searchText]);

    const handleInput = (event) => {
        setSearchText(event.target.value);
    };

    const closeSearch = () => {
        setSearchText("");
        setArticles([]);
    };

    return (
        <div className="header-search">
            <input
                className="search-input"
                type="search"
                placeholder="Search..."
                value={searchText}
                onInput={handleInput}
                autoComplete="off"
            />

            {searchText.trim().length >= 2 && (
                <div className="search-results">

                    {loading && (
                        <div className="search-message">
                            Searching...
                        </div>
                    )}

                    {error && (
                        <div className="search-message search-error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        articles.length === 0 && (
                            <div className="search-message">
                                No articles found
                            </div>
                        )}

                    {!loading && articles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/post/${article.slug}`}
                            className="search-result-item"
                            onClick={closeSearch}
                        >
                            {article.image && (
                                <img
                                    src={article.image}
                                    alt={article.title}
                                />
                            )}

                            <div>
                                <h6>{article.title}</h6>

                                {article.category_name && (
                                    <span>
                                        {article.category_name}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}

                </div>
            )}
        </div>
    );
}

export default Search;