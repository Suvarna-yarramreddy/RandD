import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { MenuBook, Assignment, MonetizationOn, Work, Groups, School, Description, People } from '@mui/icons-material';

const DepartmentDashboard = () => {
  const [stats, setStats] = useState({
    total_faculty: 0,
    total_publications: 0,
    total_patents: 0,
    total_seedmoney: 0,
    total_external: 0,
    total_consultancy: 0,
    total_proposal: 0,
    total_scholar: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const coordinatorName = sessionStorage.getItem('coordinator_name') || 'Coordinator';
  const coordinatorId = sessionStorage.getItem('coordinatorid');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/stats/department/${coordinatorId}`)
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching department statistics:', error);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false);
      });
  }, [coordinatorId]);

  const pieData = [
    { name: 'Publications', value: stats.total_publications },
    { name: 'Patents', value: stats.total_patents },
    { name: 'Seed Money', value: stats.total_seedmoney },
    { name: 'External Funded Projects', value: stats.total_external },
    { name: 'Consultancy', value: stats.total_consultancy },
    { name: 'Research Scholars', value: stats.total_scholar },
    { name: 'Proposals Submitted', value: stats.total_proposal },
  ];

  const COLORS = ['#F94144', '#F3722C', '#F9C74F', '#90BE6D', '#43AA8B', '#577590', '#8E44AD', '#D67D3E'];

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
    <Container fluid style={{ padding: '20px' }}>
      {/* Welcome Message */}
      <div className="text mb-4">
        <h2 style={{ fontWeight: 'bold', color: '#333' }}>Welcome!!</h2>
        <p style={{ fontSize: '16px', color: '#333' }}>View your department's statistics overview.</p>
      </div>

      {/* Pie Chart & Side Cards */}
      <Row className="mt-4">
        {/* Pie Chart Column */}
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold text-center mb-3">Department Statistics Overview</Card.Title>
              {pieData.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 430}>
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
                    <Tooltip formatter={(value) =>`${value} Records`} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted fs-5">No data available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Statistics Cards */}
        <Col md={6}>
          <Row>
            {[
              { title: 'Total Faculty', value: stats.total_faculty, icon: <People style={{ color: '#D67D3E' }} /> },
              { title: 'Publications', value: stats.total_publications, icon: <MenuBook style={{ color: '#F94144' }} /> },
              { title: 'Patents', value: stats.total_patents, icon: <Assignment style={{ color: '#F3722C' }} /> },
              { title: 'Seed Money', value: stats.total_seedmoney, icon: <MonetizationOn style={{ color: '#F9C74F' }} /> },
              { title: 'External Funded Projects', value: stats.total_external, icon: <Work style={{ color: '#90BE6D' }} /> },
              { title: 'Consultancy', value: stats.total_consultancy, icon: <Groups style={{ color: '#43AA8B' }} /> },
              { title: 'Research Scholars', value: stats.total_scholar, icon: <School style={{ color: '#577590' }} /> },
              { title: 'Proposals Submitted', value: stats.total_proposal, icon: <Description style={{ color: '#8E44AD' }} /> },
            ].map((item, index) => (
              <Col xs={6} className="mb-3" key={index}>
                <Card
                  className="p-3 shadow-sm"
                  style={{
                    height: '120px',
                    borderLeft: `5px solid ${COLORS[index % COLORS.length]}`,
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Card.Body className="d-flex align-items-center">
                    <div style={{ fontSize: '24px', marginRight: '10px' }}>{item.icon}</div>
                    <div>
                      <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.title}</Card.Title>
                      <Card.Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{item.value}</Card.Text>
                    </div>
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

export default DepartmentDashboard;