/*
 * MemberCard.jsx
 * This is a simple UI component representing a team member card.
 */
// Component to display an individual team member's details
function MemberCard({ name, role, qualification, github, linkedin }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{qualification}</p>
      <p>Project Role: {role}</p>
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