function MemberCard({ name, role, qualification, github, linkedin }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Role: {role}</p>
      <p>Qualification: {qualification}</p>
      <p>
        GitHub: <a href={github}>{github}</a>
      </p>
      <p>
        LinkedIn: <a href={linkedin}>{linkedin}</a>
      </p>
    </div>
  )
}

export default MemberCard
