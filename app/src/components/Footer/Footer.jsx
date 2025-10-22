import React from "react";
import "bulma/css/bulma.min.css";

// Import images from src
import MohammedShinan from "../../assets/Mohammed_shinan.jpg";
import MohammedShamil from "../../assets/Mohemmed_shamil.k.jpg";
import MuhammadJasim from "../../assets/jasim.png";
import MohammedNihad from "../../assets/MUHAMMED_NIHAD.jpg";
import MohammedMidhulaj from "../../assets/Mohammed_Midhulaj.jpg";

const Footer = () => {
  const teamMembers = [

    {
      name: "Mohammed Shinan",
      github: "#",
      image: MohammedShinan
    },
    {
      name: "Mohammed Shamil K",
      github: "#",
      image: MohammedShamil
    },
    {
      name: "Muhammad Jasim P",
      github: "#",
      image: MuhammadJasim
    },
    {
      name: "Mohammed Nihad K",
      github: "#",
      image: MohammedNihad
    },
    {
      name: "Mohammed Midhulaj",
      github: "#",
      image: MohammedMidhulaj
    }
  ];

  const containerStyle = {
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    color: 'white',
    padding: '3rem 1.5rem',
    width: '100%',
    borderTop: '3px solid #ff6f61'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  };

  const teamGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '2rem',
    justifyContent: 'center',
    margin: '0 auto 2rem auto'
  };

  const teamMemberStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'transform 0.3s ease'
  };

  const memberImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '3px solid #ff6f61',
    marginBottom: '0.75rem',
    background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const memberNameStyle = {
    color: 'white',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.3s ease'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Team Members Section */}
        <div>
          <h4 style={{ 
            color: '#ff6f61', 
            fontSize: '2rem', 
            fontWeight: '700', 
            marginBottom: '2rem',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Meet Our Team
          </h4>
          <div style={teamGridStyle}>
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                style={teamMemberStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {member.image && (
                  <div style={memberImageStyle}>
                    <img 
                      src={member.image} 
                      alt={member.name}
                      style={imageStyle}
                    />
                  </div>
                )}
                {!member.image && (
                  <div style={memberImageStyle}>
                    <div style={{
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                )}
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={memberNameStyle}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ff6f61';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'white';
                  }}
                >
                  {member.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #ff6f61, #ff8e53, transparent)',
          margin: '3rem auto',
          maxWidth: '300px',
          borderRadius: '2px'
        }}></div>

        {/* Project Info Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h5 style={{ 
            color: '#ff8e53', 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '1rem'
          }}>
            FlavorCraft Recipe Portal
          </h5>
          <p style={{ 
            color: '#cbd5e0', 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 1.5rem auto'
          }}>
            Discover, create, and share amazing recipes with our community of home cooks
          </p>
        </div>

        {/* GitHub Link */}
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="https://github.com/OptimisticTrousers/cooking-recipe-portal"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#ff6f61', 
              fontWeight: '600',
              fontSize: '1.1rem',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              border: '2px solid #ff6f61',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ff6f61';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#ff6f61';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>

        {/* Copyright */}
        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ 
            color: '#a0aec0', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            © {new Date().getFullYear()} FlavorCraft. Built with passion for the culinary arts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;