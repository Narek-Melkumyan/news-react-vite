// components/PageHeaderArticle.jsx

import React from 'react';
import {Link} from "react-router-dom";

function PageHeader({
                        title,
                        subtitle,
                        breadcrumb,
                        userName
                    }) {
    return (
        <div className="page-header">
            <div>
                <div className="breadcrumb-bar">
                    <a href="#">
                        <i className="bi bi-house-door"></i>
                    </a>

                    <span>·</span>

                    <span>{breadcrumb}</span>
                </div>

                <h1 className="page-title">
                    {title}, {userName} 👋
                </h1>

                <div className="page-subtitle">
                    {subtitle}
                </div>
            </div>

            <div className="d-flex gap-2">

                <Link to={"/admin/createArticle"} href="articles.html" className="btn btn-primary btn-icon">
                    <i className="bi bi-plus-lg"></i>
                    {" "}New article
                </Link>
            </div>
        </div>
    );
}

export default PageHeader;