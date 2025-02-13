import React, { useState, useEffect } from 'react';

const InstituteCorViewPublications = () => {
    const [publications, setPublications] = useState([]);
    const [visiblePublicationId, setVisiblePublicationId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [publicationToReject, setPublicationToReject] = useState(null);


    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getAllPublicationsOfInst`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch publications');
                }
                const data = await response.json();
                setPublications(data);
            } catch (error) {
                console.error('Error fetching publications:', error);
            }
        };
        fetchPublications();
    }, []); // Remove instituteCoordinatorId dependency
    

    const togglePublicationDetails = (publicationId) => {
        setVisiblePublicationId(visiblePublicationId === publicationId ? null : publicationId);
    };

    const approvePublication = async (publicationId) => {
        try {
            const response = await fetch(`http://localhost:5000/approvePublicationOfInst/${publicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to approve publication');
            }

            setPublications(publications.filter(pub => pub.publication_id !== publicationId));
        } catch (error) {
            console.error('Error approving publication:', error);
        }
    };

    const rejectPublication = async (publicationId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/rejectPublicationOfInst/${publicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to reject publication');
            }

            setPublications(publications.filter(pub => pub.publication_id !== publicationId));
            setRejectionReason('');
            setPublicationToReject(null);
        } catch (error) {
            console.error('Error rejecting publication:', error);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4">Institute Coordinator: Pending Publications</h1>
            {publications.length > 0 ? (
                <div className="row">
                    {publications.map(pub => (
                        <div className="col-md-6 mb-4" key={pub.publication_id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap d-md-flex"
                                            style={{ minWidth: "0" }}>
                                            <h5 className="card-title" style={{ wordBreak: "break-word", flex: "1 1 auto" }}>
                                                Cite As:&nbsp;
                                                <a
                                                    href="#!"
                                                    onClick={() => togglePublicationDetails(pub.publication_id)}
                                                    className="text-primary"
                                                >
                                                    {pub.citeAs}
                                                </a>
                                            </h5>

                                            <span 
                                                className="badge bg-info text-dark mt-2 mt-md-0 text-wrap"
                                                style={{ 
                                                    whiteSpace: "normal",  // Allows text wrapping 
                                                    wordBreak: "break-word", // Breaks long words properly
                                                    maxWidth: "100%"  // Ensures it does not overflow
                                                }}
                                            >
                                                {pub.status}
                                            </span>
                                        </div>
                                    {visiblePublicationId === pub.publication_id && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                            {pub.natureOfPublication && <p><strong>Nature of Publication:</strong> {pub.natureOfPublication}</p>}
                                                    {pub.typeOfPublication && <p><strong>Type of Publication:</strong> {pub.typeOfPublication}</p>}
                                                    {pub.titleOfPaper && <p><strong>Title of Paper:</strong> {pub.titleOfPaper}</p>}
                                                    {pub.nameOfJournalConference && <p><strong>Journal/Conference:</strong> {pub.nameOfJournalConference}</p>}
                                                    {pub.titleofChapter && <p><strong>Title of Chapter:</strong> {pub.titleofChapter}</p>}
                                                    {pub.nameofbook && <p><strong>Name of Book:</strong> {pub.nameofbook}</p>}
                                                    {pub.nameOfPublisher && <p><strong>Publisher:</strong> {pub.nameOfPublisher}</p>}
                                                    {pub.quartile && <p><strong>Quartile:</strong> {pub.quartile}</p>}
                                                    {pub.issnIsbn && <p><strong>ISSN/ISBN:</strong> {pub.issnIsbn}</p>}
                                                    {pub.authorStatus && <p><strong>Author Status:</strong> {pub.authorStatus}</p>}
                                                    {pub.firstAuthorName && <p><strong>First Author Name:</strong> {pub.firstAuthorName}</p>}
                                                    {pub.firstAuthorAffiliation && <p><strong>First Author Affiliation:</strong> {pub.firstAuthorAffiliation}</p>}
                                                    {pub.coAuthors && <p><strong>Co-Authors:</strong> {pub.coAuthors}</p>}
                                                    {pub.indexed && <p><strong>Indexed:</strong> {pub.indexed}</p>}
                                                    {pub.impactFactor && <p><strong>Impact Factor:</strong> {pub.impactFactor}</p>}
                                                    {pub.doi && <p><strong>DOI:</strong> {pub.doi}</p>}
                                                    {pub.linkOfPaper && (
                                                        <p>
                                                            <strong>Link to Paper:</strong>{" "}
                                                            <a href={pub.linkOfPaper} target="_blank" rel="noopener noreferrer">
                                                            {pub.linkOfPaper}
                                                            </a>
                                                        </p>
                                                        )}

                                                        {pub.scopusLink && (
                                                        <p>
                                                            <strong>Scopus Link:</strong>{" "}
                                                            <a href={pub.scopusLink} target="_blank" rel="noopener noreferrer">
                                                            {pub.scopusLink}
                                                            </a>
                                                        </p>
                                                        )}

                                                    {pub.volume && <p><strong>Volume:</strong> {pub.volume}</p>}
                                                    {pub.pageNo && <p><strong>Page Number:</strong> {pub.pageNo}</p>}
                                                    {pub.monthYear && <p><strong>Month & Year:</strong> {pub.monthYear}</p>}
    
                                                    {pub.proofOfPublication && (
                                                        <p><strong>Proof of Publication:</strong> 
                                                        <a href={`http://localhost:5000/${pub.proofOfPublication}`} target="_blank" rel="noopener noreferrer">
                                                            View Proof
                                                        </a>
                                                    </p>
                                                    
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center mt-3">
                                    <button 
                                        className="btn btn-success w-49 mb-3" 
                                        onClick={() => approvePublication(pub.publication_id)}
                                    >
                                        Approve
                                    </button>

                                    <button 
                                        className="btn btn-danger w-49 mb-3 ms-2" 
                                        onClick={() => setPublicationToReject(pub.publication_id)}
                                    >
                                        Reject
                                    </button>
                                </div>

                                {publicationToReject === pub.publication_id && (
                                    <div className="mt-3">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason for rejection"
                                        />
                                        <button 
                                            className="btn btn-danger w-100 mt-2" 
                                            onClick={() => rejectPublication(pub.publication_id)}
                                        >
                                            Submit Rejection
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No publications available for approval.</p>
            )}
        </div>
    );
};

export default InstituteCorViewPublications;
