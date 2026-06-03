import PollsHeader from "../components/polls/pollsHeader.jsx";
import PollsStats from "../components/polls/pollsStats.jsx";
import PollsModal from "../components/polls/pollsModal.jsx";
import {useEffect, useState} from "react";
import PollCard from "../components/polls/pollCard.jsx";

function Polls() {

    const [open, setOpen] = useState(false);
    const [polls, setPolls] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3010/admin/polls/getPolls",{
            credentials: "include",
        }).then(res => res.json()).then(data => {
            setPolls(data.polls);
        })
    },[])




    return (
        <div className="page">

            <PollsHeader open={() => setOpen(true)} />

            <PollsStats polls={polls} />


            <div className="card">
                <div className="table-toolbar">
                    <div className="search">
                        <i className="bi bi-search"></i>
                        <input type="text" id="pollSearch" placeholder="Search polls..."/>
                    </div>
                    <select className="form-select" id="pollStatusFilter" style={{width:"auto"}}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Question</th>
                            <th>Total Votes</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th style={{width:"140px"}}>Actions</th>
                        </tr>
                        </thead>
                        <tbody id="pollTbody">
                        {polls?.map((poll, index) => (
                            <PollCard poll={poll} key={index} />
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-foot">
                    <span>Showing <strong>1-3</strong> of <strong>3</strong> polls</span>
                    <ul className="pagination mb-0">
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    </ul>
                </div>
            </div>
            {open && <PollsModal close={() => setOpen(false)} />}


        </div>


    );
}

export default Polls;