import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";

function Search() {

    const [searchText, setSearchText] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState("");

    const abortControllerRef = useRef(null);

    const value = searchText.trim();
    const isSearchOpen = value.length >= 3;

    useEffect(() => {
        if (!isSearchOpen) {
            abortControllerRef.current?.abort();

            setArticles([]);
            setError("");
            setLoading(false);
            setCaptchaToken("");

            return;
        }

        if (!captchaToken) {
            setArticles([]);
            setLoading(false);
            return;
        }

        const timeout = setTimeout(async () => {
            abortControllerRef.current?.abort();

            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:3010/search?q=${encodeURIComponent(value)}`,
                    {
                        method: "GET",
                        headers: {
                            "x-turnstile-token": captchaToken
                        },
                        signal: controller.signal
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Search failed"
                    );
                }

                setArticles(result.articles || []);
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                setError(error.message || "Search failed");
                setArticles([]);
            } finally {
                if (abortControllerRef.current === controller) {
                    setLoading(false);
                }
            }
        }, 600);

        return () => {
            clearTimeout(timeout);
            abortControllerRef.current?.abort();
        };
    }, [value, captchaToken, isSearchOpen]);

    const handleInput = (event) => {
        setSearchText(event.target.value);
        setError("");
    };

    const closeSearch = () => {
        abortControllerRef.current?.abort();

        setSearchText("");
        setArticles([]);
        setError("");
        setLoading(false);
        setCaptchaToken("");
    };

    return (
        <div className="header-search">
            <input
                className="search-input"
                type="search"
                placeholder="Search..."
                value={searchText}
                onChange={handleInput}
                autoComplete="off"
                maxLength={100}
            />

            {isSearchOpen && (
                <div className="search-results">
                    {!captchaToken && !error && (
                        <div className="search-captcha">
                            <Turnstile
                                siteKey={
                                    import.meta.env
                                        .VITE_TURNSTILE_SITE_KEY
                                }
                                onSuccess={(token) => {
                                    setCaptchaToken(token);
                                    setError("");
                                }}
                                onExpire={() => {
                                    setCaptchaToken("");
                                    setArticles([]);
                                }}
                                onError={() => {
                                    setCaptchaToken("");
                                    setArticles([]);
                                    setError(
                                        "Captcha verification failed"
                                    );
                                }}
                                options={{
                                    theme: "light",
                                    size: "normal"
                                }}
                            />

                            <div className="search-message">
                                Complete the verification to search
                            </div>
                        </div>
                    )}

                    {captchaToken && loading && (
                        <div className="search-message">
                            Searching...
                        </div>
                    )}

                    {error && (
                        <div className="search-message search-error">
                            {error}
                        </div>
                    )}

                    {captchaToken && !loading && !error && articles.length === 0 && (
                            <div className="search-message">
                                No articles found
                            </div>
                        )}

                    {captchaToken && !loading && !error && articles.map((article) => (
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