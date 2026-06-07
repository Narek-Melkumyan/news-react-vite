function PollResultsModal({ close, data }) {
    const { poll, totalVotes, results } = data;

    return (
        <>
            <div
                className="modal fade show"
                style={{ display: "block" }}
                tabIndex="-1"
                aria-modal="true"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <h5 className="modal-title">
                                    Poll Results
                                </h5>

                                <div className="text-muted-2">
                                    {poll.question}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={close}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="mb-4">
                                <strong>Total votes: {totalVotes}</strong>
                            </div>

                            {results.map((option) => (
                                <div
                                    key={option.id}
                                    className="mb-4"
                                >
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>{option.option_text}</span>

                                        <span>
                                            <strong>{option.votes}</strong>{" "}
                                            votes · {option.percentage}%
                                        </span>
                                    </div>

                                    <div
                                        className="progress"
                                        style={{ height: "10px" }}
                                    >
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: `${option.percentage}%`,
                                            }}
                                            aria-valuenow={
                                                option.percentage
                                            }
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                            ))}

                            {results.length === 0 && (
                                <p className="text-muted-2 mb-0">
                                    This poll has no options.
                                </p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={close}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show" />
        </>
    );
}

export default PollResultsModal;