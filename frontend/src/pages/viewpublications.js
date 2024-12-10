import React, { useState, useEffect } from 'react';
import { useFaculty } from "./facultyContext";

const PublicationsPage = () => {
    const [publications, setPublications] = useState([]);
    const { faculty_id } = useFaculty();

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getPublications/${faculty_id}`);
                if (!response.ok) {
                    // Log the error response to inspect it
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch publications');
                }

                // Log the response data for inspection
                const data = await response.json();
                setPublications(data);
            } catch (error) {
                console.error('Error fetching publications:', error);
            }
        };

        fetchPublications();
    }, [faculty_id]);

return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
    <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>Your Publications</h1>

    {publications.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {publications.map(pub => (
                <div
                    key={pub.publication_id}
                    style={{
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>
                        {pub.titleOfPaper}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Nature of Publication:</span> {pub.natureOfPublication}
                        </p>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Type of Publication:</span> {pub.typeOfPublication}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Journal/Conference:</span> {pub.nameOfJournalConference}
                        </p>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Publisher:</span> {pub.nameOfPublisher}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>ISSN/ISBN:</span> {pub.issnIsbn}
                        </p>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Author Status:</span> {pub.authorStatus}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>First Author Name:</span> {pub.firstAuthorName}
                        </p>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>First Author Affiliation:</span> {pub.firstAuthorAffiliation}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Co-authors:</span> {pub.coAuthors}
                        </p>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Indexed:</span> {pub.indexed}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Quartile:</span> {pub.quartile}
                        </p>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Impact Factor:</span> {pub.impactFactor}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {pub.doi && (
                            <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                <span style={{ color: '#333' }}>DOI:</span> <a href={pub.doi} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{pub.doi}</a>
                            </p>
                        )}
                        {pub.linkOfPaper && (
                            <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                <span style={{ color: '#333' }}>Link of Paper:</span> <a href={pub.linkOfPaper} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{pub.linkOfPaper}</a>
                            </p>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {pub.scopusLink && (
                            <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                <span style={{ color: '#333' }}>Scopus Link:</span> <a href={pub.scopusLink} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{pub.scopusLink}</a>
                            </p>
                        )}
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Volume:</span> {pub.volume}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Page Number:</span> {pub.pageNo}
                        </p>
                        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                            <span style={{ color: '#333' }}>Month/Year:</span> {pub.monthYear}
                        </p>
                    </div>
                    <p style={{ fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                        <span style={{ color: '#333' }}>Cite As:</span> {pub.citeAs}
                    </p>
                </div>
            ))}
        </div>
    ) : (
        <p style={{ fontSize: '18px', color: '#555', textAlign: 'center' }}>No publications available. Please check again later.</p>
    )}
</div>
);
};
export default PublicationsPage;