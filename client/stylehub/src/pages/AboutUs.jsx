import Header from '../components/Navbar.jsx'
import Footer from '../components/Footer'
import DottedSurface from '../components/DottedSurface'
import '../styles/AboutUs.css'

function AboutUs() {
  const backendMembers = [
    { name: 'Renjeesh R.S (Concept)', role: 'Backend - Express', qualification: 'Mern Stack Developer', github: 'https://github.com/renjeesh-rs', linkedin: 'https://www.linkedin.com/in/renjeesh-r-s-5408b7381/' },
    { name: 'Jerin Moni Thomas', role: 'Application Architecture', qualification: 'Java Fullstack Developer', github: 'https://github.com/jerinmt', linkedin: 'https://www.linkedin.com/in/jerin-moni-thomas-software-developer' },
    { name: 'Gopika.Gopakumar', role: 'Backend - Express', qualification: 'Mern Stack Developer', github: 'https://github.com/Gopi121202', linkedin: 'https://www.linkedin.com/in/gopika-gopakumar1202' },
    { name: 'Alfin Muhammed', role: 'Backend - Express', qualification: 'Mern Stack Developer', github: 'https://github.com/Alfin77', linkedin: 'https://www.linkedin.com/in/alfin-muhammed-n-s-8aa85831b' },
    { name: 'Ananda.M.P', role: 'Backend - Express', qualification: 'Mern Stack Developer', github: 'https://github.com/anandapavanan', linkedin: 'www.linkedin.com/in/ananda-m-p-b7989826b' },
  ]

  const frontendMembers = [
    { name: 'Noufa.S', role: 'Frontend - React', qualification: 'Mern Stack Developer', github: 'https://github.com/noufasaji-maker', linkedin: 'www.linkedin.com/in/noufa-sajna-291649380' },   
    { name: 'Karthika.K.S', role: 'Frontend - React', qualification: 'Python Fullstack Developer', github: 'https://github.com/karthikasuresh31-subith', linkedin: 'https://www.linkedin.com/in/karthika-k-s-53b074381' },
    { name: 'Archana.R', role: 'Frontend - React', qualification: 'Python Fullstack Developer', github: 'https://github.com/archanarx', linkedin: 'https://www.linkedin.com/in/archanaa-r-/' },
    { name: 'Devika', role: 'Frontend - React', qualification: 'Mern Stack Developer', github: 'https://github.com/Devikanavakumar', linkedin: 'https://www.linkedin.com/in/devika-navakumar-b55131300' },
    { name: 'Shino.S.B', role: 'Frontend - React', qualification: 'Mern Stack Developer', github: 'https://github.com/shinolulu69-code', linkedin: 'https://www.linkedin.com/in/shino-s-b-0371923b6' },
    { name: 'Vivek.V', role: 'Frontend - React', qualification: 'Java Fullstack Developer', github: 'https://github.com/vivi241', linkedin: 'https://www.linkedin.com/in/vivek-v-591763251' },
    { name: 'Ijas Faizy', role: 'Frontend - React', qualification: 'Mern Stack Developer', github: 'https://github.com/member4', linkedin: 'https://www.linkedin.com/in/ijas-faizy-bb7197316' },
  ]

  const uiuxDesigners = [
    { name: 'Afsal.A', role: 'UI/UX Designer', qualification: 'Mern Stack Developer', github: 'https://github.com/afsalazeez29-code', linkedin: 'https://www.linkedin.com/in/afsal-a-azeez29' },
    { name: 'Sahad', role: 'Logo and Animation Designer', qualification: 'Python Fullstack Developer', github: 'https://github.com/sahadnishy-css', linkedin: 'https://www.linkedin.com/in/member4' },
  ]

  const MemberCard = ({ member, variant }) => (
    <div className={`mc mc--${variant}`}>
      <div className="mc__glow" />
      <div className="mc__top">
        <span className="mc__sparkle">✦</span>
        <h3 className="mc__name">{member.name}</h3>
        <p className="mc__role">{member.role}</p>
        <p className="mc__qual">{member.qualification}</p>
      </div>
      <div className="mc__links">
        <a className="mc__link" href={member.github} target="_blank" rel="noreferrer">GitHub</a>
        <a className="mc__link" href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </div>
  )

  const Divider = () => (
    <div className="team-divider">
      <div className="team-divider__line" />
      <div className="team-divider__orb" />
      <div className="team-divider__line" />
    </div>
  )

  return (
    <>
      <DottedSurface theme="dark">
        <Header />

        <div className="about-page">

          <div className="about-hero">
            <p className="about-eyebrow">About Us</p>
            <h1 className="about-title">Developers</h1>
            <p className="about-desc">
              We are a team of web developers passionate about creating beautiful,
              functional websites and building simple, useful web applications. We
              focus on creativity, quality, and user-friendly design.
            </p>
          </div>

          <div className="team-split">

            {/* Left — Backend */}
            <div className="team-col team-col--backend">
              <div className="team-col__header">
                <span className="team-col__icon">⚙</span>
                <h2 className="team-col__title">Backend Engineers</h2>
              </div>
              <div className="team-col__cards">
                {backendMembers.map((member, i) => (
                  <MemberCard key={member.github + i} member={member} variant="backend" />
                ))}
              </div>
            </div>

            <Divider />

            {/* Center — Frontend */}
            <div className="team-col team-col--frontend">
              <div className="team-col__header">
                <span className="team-col__icon">✦</span>
                <h2 className="team-col__title">Frontend Engineers</h2>
              </div>
              <div className="team-col__cards">
                {frontendMembers.map((member, i) => (
                  <MemberCard key={member.github + i} member={member} variant="frontend" />
                ))}
              </div>
            </div>

            <Divider />

            {/* Right — UI/UX */}
            <div className="team-col team-col--uiux">
              <div className="team-col__header">
                <span className="team-col__icon">◈</span>
                <h2 className="team-col__title">UI/UX Designers</h2>
              </div>
              <div className="team-col__cards">
                {uiuxDesigners.map((member, i) => (
                  <MemberCard key={member.github + i} member={member} variant="uiux" />
                ))}
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </DottedSurface>
    </>
  )
}

export default AboutUs