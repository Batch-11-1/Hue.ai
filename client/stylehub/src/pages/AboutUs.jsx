import MemberCard from '../components/MemberCard'

function AboutUs() {
  const members = [
    {
      name: 'Team Member 1',
      role: 'Frontend Developer',
      qualification: 'BSc in Computer Science',
      github: 'https://github.com/member1',
      linkedin: 'https://www.linkedin.com/in/member1'
    },
    {
      name: 'Team Member 2',
      role: 'Backend Developer',
      qualification: 'BSc in Software Engineering',
      github: 'https://github.com/member2',
      linkedin: 'https://www.linkedin.com/in/member2'
    },
    {
      name: 'Team Member 3',
      role: 'UI/UX Designer',
      qualification: 'Diploma in Interaction Design',
      github: 'https://github.com/member3',
      linkedin: 'https://www.linkedin.com/in/member3'
    },
    {
      name: 'Team Member 4',
      role: 'Project Manager',
      qualification: 'BBA in Information Systems',
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
