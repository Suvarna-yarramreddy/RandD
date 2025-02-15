import React, { useEffect, useState } from 'react'; // Import React hooks
import { Card, Row, Col, Container, Spinner, Alert } from 'react-bootstrap'; // Import Bootstrap components
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'; // Import Recharts components
import axios from 'axios'; // Import axios for HTTP requests
import { MenuBook, Assignment, MonetizationOn, Work, Groups, School, Description } from '@mui/icons-material'; // Import Material UI icons

const HomePage = () => {
  const [stats, setStats] = useState({
    total_faculty: 0,
    total_logins: 0,
    total_publications: 0,
    total_patents: 0,
    total_seedmoney:0,
    total_external:0,
    total_consultancy:0,
    total_proposal:0,
    total_scholar:0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const facultyName = sessionStorage.getItem('faculty_name');
  const facultyId = sessionStorage.getItem('faculty_id');
  
  useEffect(() => {
    // Fetch overall statistics
    axios
      .get(`http://localhost:5000/api/stats/${facultyId}`)
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setError('Failed to load overall statistics. Please try again later.');
        setLoading(false);
      });
  }, [facultyId]);

  const pieData = [
    { name: 'Faculties', value: stats.total_faculty },
    { name: 'Publications', value: stats.total_publications },
    { name: 'Patents', value: stats.total_patents },
    { name: 'Seed Money',value:stats.total_seedmoney},
    { name: 'External Funded Projects',value:stats.total_external},
    { name: 'Consultancy',value:stats.total_consultancy},
    { name: 'Research Scholars',value:stats.total_scholar},
    { name: 'Proposals Submitted',value:stats.total_proposal},

  ];

  const COLORS = ['#F94144', '#F3722C', '#F9C74F', '#90BE6D', '#43AA8B', '#577590', '#8E44AD','#D67D3E' ];

  if (loading) {
    return (
      <Container className="text-center" style={{ paddingTop: '20px' }}>
        <Spinner animation="border" variant="primary" />
        <h3>Loading statistics...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center" style={{ paddingTop: '20px' }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>

        {/* Main Content Area */}
          <h2>Welcome, {facultyName}!</h2>
          <p>This is your dashboard with key statistics visualized.</p>

          {/* Pie Chart Section */}
          <Row className="mt-4">
        {/* Pie Chart Column */}
        <Col md={6}>
          <Card className="p-2 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold text-center">Overall Faculty Statistics Overview</Card.Title>
              {pieData.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={5} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted">No data available to display.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Side Cards Column */}
        <Col md={6}>
            <Row>
              {[
                { title: "Publications", value: stats.total_publications, icon: <MenuBook /> },
                { title: "Patents", value: stats.total_patents, icon: <Assignment /> },
                { title: "Seed Money", value: stats.total_seedmoney, icon: <MonetizationOn /> },
                { title: "External Funded Projects", value: stats.total_external, icon: <Work /> },
                { title: "Consultancy", value: stats.total_consultancy, icon: <Groups /> },
                { title: "Research Scholars", value: stats.total_scholar, icon: <School /> },
                { title: "Proposals", value: stats.total_proposal, icon: <Description /> },
              ].map((item, index) => (
                <Col xs={6} className="mb-3" key={index}>
                  <Card className="p-2 shadow-sm" style={{ height: "100px" }}>
                    <Card.Body>
                      <Card.Title>
                        {item.icon} {item.title}
                      </Card.Title>
                      <Card.Text>{item.value}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
    </Container>
  );
};

export default HomePage;