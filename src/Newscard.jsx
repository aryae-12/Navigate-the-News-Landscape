import './NewsCard.css'

function NewsCard({ title, description, imageUrl }) {
  return (
    <div className="card">
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h3>{title}</h3>
      <p>{description}</p>
      <button>Read More</button>
    </div>
  )
}

export default NewsCard
