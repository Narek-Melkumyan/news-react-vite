import React, { useEffect, useState } from "react";
import CardIndex from "../components/cards/cardIndex.jsx";

function ExternalNews() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const articlesPerPage = 12;

    useEffect(() => {
        fetch("http://localhost:3010/rss")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load news");
                }

                return response.json();
            })
            .then((result) => {
                setArticles(result.data || []);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;

    const currentArticles = articles.slice(startIndex, endIndex);

    const changePage = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const previousPage = () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    return (
        <section className="external-news py-5">
            <div className="container">
                <h1 className="mb-4">From other sources</h1>

                <div className="row g-4">
                    {currentArticles.map((article, index) => (
                        <div
                            className="col-12 col-xl-3 col-lg-4 col-md-6 col-sm-6"
                            key={article.id || `${article.link}-${index}`}
                        >
                            <CardIndex
                                value={article}
                                variant="v5"
                            />
                        </div>
                    ))}
                </div>

                {articles.length === 0 && (
                    <p>No news found։</p>
                )}

                {totalPages > 1 && (
                    <nav
                        className="d-flex justify-content-center mt-5"
                        aria-label="News pagination"
                    >
                        <ul className="pagination">
                            <li
                                className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                }`}
                            >
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={previousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => {
                                    const page = index + 1;

                                    return (
                                        <li
                                            className={`page-item ${
                                                currentPage === page
                                                    ? "active"
                                                    : ""
                                            }`}
                                            key={page}
                                        >
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() =>
                                                    changePage(page)
                                                }
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    );
                                }
                            )}

                            <li
                                className={`page-item ${
                                    currentPage === totalPages
                                        ? "disabled"
                                        : ""
                                }`}
                            >
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </section>
    );
}

export default ExternalNews;