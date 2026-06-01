
function PollsModal({ close }) {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const question = formData.get("question");
        const start_date = formData.get("start_date");
        const end_date = formData.get("end_date");
        const status = formData.get("status");

        const options = formData
            .getAll("options")
            .map(option => option.trim())
            .filter(option => option !== "");

        const pollData = {
            question,
            options,
            start_date,
            end_date,
            status,
        };

        console.log(pollData);

        const res = await fetch("http://localhost:3010/admin/polls/addPoll", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pollData),
        });

        const data = await res.json();
        console.log(data);
        close()
    };



    return (
        <div className="modal fade show" id="pollModal" tabIndex="-1"style={{ display: "block", paddingLeft: "0px" }}
             aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <form className="modal-content" onSubmit={handleSubmit} id="pollForm" noValidate="">
                    <div className="modal-header">
                        <h5 className="modal-title" id="pollModalTitle">Create New Poll</h5>
                        <button type="button" className="btn-close" onClick={close} data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <input type="hidden" id="pollId" value=""/>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="pollQuestion">Poll Question <span
                                className="text-danger">*</span></label>
                            <input type="text" id="pollQuestion" name={"question"} className="form-control form-control-lg"
                                   placeholder="e.g. Who will win the election?" required=""/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label d-flex justify-content-between">
                                Options <span className="text-danger">*</span>
                                <button type="button" className="btn btn-soft-primary btn-sm btn-icon"
                                        id="pollAddOptBtn"><i className="bi bi-plus-lg"></i> Add option
                                </button>
                            </label>
                            <div id="pollOptionsWrap">
                                <div className="poll-option-row">
                                    <input
                                        type="text"
                                        className="form-control poll-opt"
                                        name="options"
                                        placeholder="Option text"
                                    />
                                    <button type="button" className="btn-remove-opt" title="Remove">
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                <div className="poll-option-row">
                                    <input
                                        type="text"
                                        className="form-control poll-opt"
                                        name="options"
                                        placeholder="Option text"
                                    />
                                    <button type="button" className="btn-remove-opt" title="Remove">
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="form-text">A poll needs at least two options. Use the × to remove.</div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="pollStart">Start date</label>
                                <input type="date" id="pollStart" name={"start_date"} className="form-control"/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="pollEnd">End date</label>
                                <input type="date" id="pollEnd" name={"end_date"} className="form-control"/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="pollStatus">Status</label>
                                <select id="pollStatus" name={"status"} className="form-select">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-bs-dismiss="modal" onClick={close}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Poll</button>
                    </div>
                </form>
            </div>
        </div>);
}

export default PollsModal;

