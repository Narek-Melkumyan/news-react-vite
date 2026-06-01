import ArticlesTable from "../components/articles/articlesTable.jsx";
import StatsCards from "../components/articles/statsCards.jsx";
import PageHeaderArticle from "../components/articles/pageHeaderArticle.jsx";

function Articles() {

    return (
        <div className="page">

            <PageHeaderArticle/>
            <StatsCards/>

            <ArticlesTable/>
        </div>
    );
}

export default Articles;