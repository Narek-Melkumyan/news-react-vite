import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ViewsChart from "../components/ViewsChart.jsx";
import RecentActivity from "../components/RecentActivity.jsx";
import { useEffect, useState } from "react";
import {apiFetch} from "../utils/apiFetch.js";

function Dashboard() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const articlesRes = await apiFetch("/admin/articles", {
                    method: "GET",
                });

                if (!articlesRes.ok) {
                    throw new Error("Failed to fetch articles");
                }

                const result = await articlesRes.json();

                const posts = Array.isArray(result)
                    ? result
                    : result.posts || result.articles || [];

                setData(posts);
            } catch (err) {
                console.log(err);
                setData([]);
            }
        }

        fetchArticles();
    }, [API_URL]);



    const fullName = user?.name || "Admin";
    const firstName = fullName.split(" ")[0];

    const totalViews = data.reduce((acc, item) => {
        return acc + Number(item.views || 0);
    }, 0);

    const formatViews = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num;
    };

    const getStartOfWeek = () => {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);

        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);

        return monday;
    };

    const startOfWeek = getStartOfWeek();

    const weekViews = data.reduce((acc, item) => {
        const postDate = new Date(item.published_at || item.created_at);

        if (postDate >= startOfWeek) {
            return acc + Number(item.views || 0);
        }

        return acc;
    }, 0);

    const viewsData = [
        { day: "Mon", views: 4200 },
        { day: "Tue", views: 5100 },
        { day: "Wed", views: 4800 },
        { day: "Thu", views: 6700 },
        { day: "Fri", views: 7800 },
        { day: "Sat", views: 6200 },
        { day: "Sun", views: 5400 },
    ];

    const activityData = [
        {
            icon: "bi-file-earmark-plus",
            color: "success",
            text: (
                <>
                    <strong>{fullName}</strong> published{" "}
                    <strong>"Global markets rally..."</strong>
                </>
            ),
            time: "12 min ago",
        },
        {
            icon: "bi-chat-dots",
            color: "brand",
            text: (
                <>
                    <strong>3 new comments</strong> waiting for moderation
                </>
            ),
            time: "34 min ago",
        },
    ];

    return (
        <div className="page">
            <PageHeader
                breadcrumb="Dashboard"
                title="Good morning"
                userName={firstName}
                subtitle="Here's what's happening across your newsroom today."
            />

            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="bi-file-text"
                        iconColor="brand"
                        trend="12.4%"
                        trendType="up"
                        value={data.length}
                        label="Total articles"
                        footer="All time published"
                    />
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="bi-eye"
                        iconColor="info"
                        trend="18.7%"
                        trendType="up"
                        value={formatViews(totalViews)}
                        label="Total views"
                        footer={`${formatViews(weekViews)} this week`}
                    />
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-xl-8">
                    <ViewsChart data={viewsData} />
                </div>

                <div className="col-12 col-xl-4">
                    <RecentActivity data={activityData} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;