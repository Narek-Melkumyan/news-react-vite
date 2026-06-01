
function Modal({close,children}) {

    return (
        <div className="modal fade show" id="catModal" tabIndex="-1" style={{display: "block"}} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" id="catForm" noValidate>

                    <div className="modal-header">

                        <h5 className="modal-title" id="catModalTitle">
                            Add New Category
                        </h5>

                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={close}></button>

                    </div>

                    <div className="modal-body">
                        {children}


                    </div>



                </div>

            </div>
        </div>
    );
}

export default Modal;