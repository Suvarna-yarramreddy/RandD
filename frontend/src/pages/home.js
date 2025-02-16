import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { MenuBook, Assignment, MonetizationOn, Work, Groups, School, Description } from '@mui/icons-material';

const HomePage = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const facultyName = sessionStorage.getItem('faculty_name') || 'Faculty';
  const facultyId = sessionStorage.getItem('faculty_id');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/stats/${facultyId}`)
      .then((response) => {
        setStats(response.data || {});
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false);
      });
  }, [facultyId]);

  const pieData = [
    { name: 'Publications', value: stats.total_publications || 0 },
    { name: 'Patents', value: stats.total_patents || 0 },
    { name: 'Seed Money', value: stats.total_seedmoney || 0 },
    { name: 'External Funded Projects', value: stats.total_external || 0 },
    { name: 'Consultancy', value: stats.total_consultancy || 0 },
    { name: 'Research Scholars', value: stats.total_scholar || 0 },
    { name: 'Proposals Submitted', value: stats.total_proposal || 0 },
  ];

  const COLORS = ['#F94144', '#F3722C', '#F9C74F', '#90BE6D', '#43AA8B', '#577590', '#8E44AD'];

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <h4>Loading statistics...</h4>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Welcome Message */}
      <div className=" mb-4">
        <h2 className="fw-bold">Welcome, {facultyName}!</h2>
        <p className="text-muted">Explore your statistics at a glance.</p>
      </div>

      <Row className="g-4">
        {/* Pie Chart Column */}
        <Col lg={6} md={12}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold text-center mb-3">Your Statistics Overview</Card.Title>
              {pieData.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="50%"
                      outerRadius="80%"
                      paddingAngle={5}
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} Records`} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted fs-5">No data available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Statistics Cards */}
        <Col lg={6} md={12}>
          <Row className="g-3">
            {[
              { title: 'Publications', value: stats.total_publications, icon: <MenuBook style={{ color: '#F94144' }}/> },
              { title: 'Patents', value: stats.total_patents, icon: <Assignment style={{ color: '#F3722C' }}/> },
              { title: 'Seed Money', value: stats.total_seedmoney, icon: <MonetizationOn style={{ color: '#F9C74F' }}/> },
              { title: 'External Funded Projects', value: stats.total_external, icon: <Work style={{ color: '#90BE6D' }}/> },
              { title: 'Consultancy', value: stats.total_consultancy, icon: <Groups style={{ color: '#43AA8B' }}/> },
              { title: 'Research Scholars', value: stats.total_scholar, icon: <School style={{ color: '#43AA8B' }}/> },
              { title: 'Proposals Submitted', value: stats.total_proposal, icon: <Description style={{ color: '#8E44AD' }}/> },
            ].map((item, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card
                  className="p-3 shadow-sm d-flex flex-row align-items-center"
                  style={{
                    borderLeft: `5px solid ${COLORS[index % COLORS.length]}`,
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div className="me-3 fs-2 text-primary">{item.icon}</div>
                  <div>
                    <Card.Title className="fs-6 fw-bold">{item.title}</Card.Title>
                    <Card.Text className="fs-5 fw-bold text-dark">{item.value || 0}</Card.Text>
                  </div>
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
