import StatCard from "../StatCard.jsx";
import {useEffect, useState} from "react";

function CategoriesStats({data}) {
    const [state, setState] = useState({
        all:0,
        active:0,
    })
    useEffect(()=>{
       if(data){
           let allCategories = data.length
           let activeCategory = data.filter(category => category.status === "active").length;
            setState({
                all:allCategories,
                active:activeCategory
            })
       }
    },[data])

    return (
        <div className="row g-3 mb-3">

            <div className="col-12 col-md-4">
                <StatCard
                    icon="bi-tags"
                    iconColor="brand"
                    trend="1 this month"
                    trendType="up"
                    value={state.all}
                    label="Total categories"
                />
            </div>

            <div className="col-12 col-md-4">
                <StatCard
                    icon="bi-check2-circle"
                    iconColor="success"
                    value={state.active}
                    label="Active categories"
                />
            </div>

            <div className="col-12 col-md-4">
                <StatCard
                    icon="bi-graph-up"
                    iconColor="purple"
                    value="Technology"
                    label="Most popular category"
                />
            </div>

        </div>
    );
}

export default CategoriesStats;