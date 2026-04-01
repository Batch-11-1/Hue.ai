import MemberCard from '../components/MemberCard'

function AboutUs() {
  const members = [
    {
      name: 'Renjeesh R.S (creator)',
      role: 'Backend - Express',
      qualification: 'Mern Stack Developer',
      github: 'https://github.com/renjeesh-rs',
      linkedin: 'https://www.linkedin.com/in/renjeesh-r-s-5408b7381/'
    },
    {
      name: 'Jerin Moni Thomas',
      role: 'Web Architecture',
      qualification: 'Java Developer',
      github: 'https://github.com/jerinmt',
      linkedin: 'https://www.linkedin.com/in/jerin-moni-thomas-software-developer'
    },

    {
      name: 'Gopika.Gopakumar',
      role: 'Backend - Express',
      qualification: 'Mern Stack Developer',
      github: 'https://github.com/Gopi121202',
      linkedin: 'https://www.linkedin.com/in/gopika-gopakumar1202'
    },
    {
      name: 'Alfin Muhammed',
      role: 'Backend - Express',
      qualification: 'Mern Stack Developer',
      github: 'https://github.com/Alfin77',
      linkedin: 'https://www.linkedin.com/in/alfin-muhammed-n-s-8aa85831b'
    },
    {
      name: 'Ananda.M.P',
      role: 'Backend - Express',
      qualification: 'Mern Stack Developer',
      github: 'https://github.com/anandapavanan',
      linkedin: 'www.linkedin.com/in/ananda-m-p-b7989826b'
    },
    {
      name: 'Archana.R',
      role: 'Frontend - React',
      qualification: 'Python Developer',
      github: 'https://github.com/archanarx',
      linkedin: 'https://www.linkedin.com/in/archanaa-r-/'
    },
    {
      name: 'Karthika.K.S',
      role: 'Frontend - React',
      qualification: 'Python Developer',
      github: 'https://github.com/karthikasuresh31-subith',
      linkedin: 'https://www.linkedin.com/in/karthika-k-s-53b074381'
    },
    {
      name: 'Shino.S.B',
      role: 'Frontend - React',
      qualification: 'Mern Stack Developer',
      github:  'https://github.com/shinolulu69-code',
      linkedin: 'https://www.linkedin.com/in/shino-s-b-0371923b6'
    },
    {
      name: 'Noufa.S',
      role: 'Frontend - React',
      qualification: 'Mern Stack Developer',
      github: 'https://github.com/noufasaji-maker',
      linkedin: 'www.linkedin.com/in/noufa-sajna-291649380'
    },
    {
      name: 'Devika',
      role: 'Frontend - React',
      qualification: 'Mern Stack Developer',
      github: 'https://github.com/Devikanavakumar',
      linkedin: 'https://www.linkedin.com/in/devika-navakumar-b55131300
    },
    {
      name: 'Vivek.V',
      role: 'Frontend - React',
      qualification: 'Java Developer',
      github: 'https://github.com/vivi241',
      linkedin: 'https://www.linkedin.com/in/vivek-v-591763251'
    },
    {
      name: 'Afsal.A',
      role: 'UX/UI Designer',
      qualification: 'Mern Stack Developer',
      github: 'https://github.com/afsalazeez29-code',
      linkedin: 'https://www.linkedin.com/in/afsal-a-azeez29'
    },
    {
      name: 'Sahad',
      role: 'UX/UI Designer',
      qualification: 'Python Fullstack Developer',
      github: 'https://github.com/member4',
      linkedin: 'https://www.linkedin.com/in/member4'
    }

  ]

  return (
    <>
      <h1>About Us</h1>
      <p>
        We are a team of beginner web developers passionate about creating beautiful, functional websites and building simple, useful web applications. We focus on creativity, quality, and user-friendly design.
      </p>
      {members.map((member) => (
        <MemberCard
          key={member.github}
          name={member.name}
          role={member.role}
          qualification={member.qualification}
          github={member.github}
          linkedin={member.linkedin}
        />
      ))}
    </>
  )
}

export default AboutUs
