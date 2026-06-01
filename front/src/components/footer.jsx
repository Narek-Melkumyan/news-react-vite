
function Footer() {
    return (
        <footer className="footer">
            <div className="container-fluid px-lg-4 py-4">
                <div className="row g-4">

                    <div className="col-lg-4">
                        <h5 className="fw-bold text-white mb-3">NewsLine</h5>
                        <p className="mb-0">
                            Breaking news, videos, analysis, and important public topics all in one place.
                        </p>
                    </div>

                    <div className="col-lg-4">
                        <h6 className="text-white fw-bold mb-3">Sections</h6>
                        <div className="d-flex flex-column gap-2">
                            <a href="#">Politics</a>
                            <a href="#">Society</a>
                            <a href="#">International</a>
                            <a href="#">Economy</a>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <h6 className="text-white fw-bold mb-3">Contact</h6>
                        <p className="mb-1">Email: info@newsline.am</p>
                        <p className="mb-0">Phone: +374 00 00 00 00</p>
                    </div>

                </div>
            </div>

            <div className="footer-bottom py-3">
                <div className="container-fluid px-lg-4">
                    © 2026 NewsLine — All rights reserved.
                </div>
            </div>
        </footer>

    );
}

export default Footer;