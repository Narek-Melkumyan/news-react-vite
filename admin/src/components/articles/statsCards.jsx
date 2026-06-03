import React, { useEffect, useState } from "react";

function StatsCards() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [stats, setStats] = useState([
        {
            id: 1,
            icon: "bi-collection",
            color: "brand",
            value: 0,
            label: "Total articles",
        },
        {
            id: 2,
            icon: "bi-check2-circle",
            color: "success",
            value: 0,
            label: "Published",
        },
        {
            id: 3,
            icon: "bi-pencil-square",
            color: "warning",
            value: 0,
            label: "Drafts",
        },
        {
            id: 4,
            icon: "bi-clock-history",
            color: "info",
            value: 0,
            label: "Scheduled",
        },
    ]);

    useEffect(() => {

        async function fetchPosts() {

            try {

                const res = await fetch(`${API_URL}/articles`, {
                    credentials: "include",
                });

                const data = await res.json();

                const posts = data.posts;

                const totalPosts = posts.length;

                const publishedPosts = posts.filter(
                    (item) => item.status === "published"
                ).length;

                const draftPosts = posts.filter(
                    (item) => item.status === "draft"
                ).length;

                const scheduledPosts = posts.filter(
                    (item) => item.status === "scheduled"
                ).length;

                setStats([
                    {
                        id: 1,
                        icon: "bi-collection",
                        color: "brand",
                        value: totalPosts,
                        label: "Total articles",
                    },
                    {
                        id: 2,
                        icon: "bi-check2-circle",
                        color: "success",
                        value: publishedPosts,
                        label: "Published",
                    },
                    {
                        id: 3,
                        icon: "bi-pencil-square",
                        color: "warning",
                        value: draftPosts,
                        label: "Drafts",
                    },
                    {
                        id: 4,
                        icon: "bi-clock-history",
                        color: "info",
                        value: scheduledPosts,
                        label: "Scheduled",
                    },
                ]);

            } catch (err) {

                console.log(err);

            }
        }

        fetchPosts();

    }, []);

    return (
        <div className="row g-3 mb-3">

            {stats.map((item) => (

                <div
                    className="col-6 col-md-3"
                    key={item.id}
                >

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className={`stat-icon ${item.color}`}>
                                <i className={`bi ${item.icon}`}></i>
                            </div>

                        </div>

                        <div>

                            <div className="stat-value">
                                {item.value}
                            </div>

                            <div className="stat-label">
                                {item.label}
                            </div>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default StatsCards;