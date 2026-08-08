import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { useState } from 'react'
import { resolveImageUrl } from '../../services/projectsService.js'

export default function ProjectCard({ project, displayNumber, onSelect }) {
  const images = [project.image, ...(project.images ?? []).map((item) => item.image)].filter(Boolean)
  const [activeImage, setActiveImage] = useState(0)
  const [isImageOpen, setIsImageOpen] = useState(false)
  const hasImages = images.length > 0
  const hasGallery = images.length > 1
  const showPrevious = () => setActiveImage((current) => (current - 1 + images.length) % images.length)
  const showNext = () => setActiveImage((current) => (current + 1) % images.length)

  return (
    <article className="project">
      <div className="project-art">
        {hasImages ? <img className="project-image" src={resolveImageUrl(images[activeImage])} alt={`${project.title} screenshot ${activeImage + 1}`} /> : <span className="project-number">{displayNumber ?? project.id}</span>}
        {hasGallery && <>
          <button className="project-image-control image-previous" type="button" onClick={showPrevious} aria-label="Previous project image"><ChevronLeft aria-hidden="true" /></button>
          <button className="project-image-control image-next" type="button" onClick={showNext} aria-label="Next project image"><ChevronRight aria-hidden="true" /></button>
          <span className="project-image-count" aria-live="polite">{activeImage + 1} / {images.length}</span>
        </>}
        {hasImages && <button className="project-image-expand" type="button" onClick={() => setIsImageOpen(true)} aria-label="Expand project image"><Expand aria-hidden="true" /></button>}
      </div>
      <button className="project-button" onClick={() => onSelect?.(project)}>
        <div className="project-info">
          <p>{project.tech_stack}</p>
          <h3>{project.title}</h3>
          <span className="project-summary">{project.description}</span>
          <span className="project-arrow"><ArrowUpRight aria-hidden="true" /></span>
        </div>
      </button>
      {isImageOpen && <div className="image-lightbox" role="presentation" onMouseDown={() => setIsImageOpen(false)}>
        <section className="image-lightbox-content" role="dialog" aria-modal="true" aria-label={`${project.title} image preview`} onMouseDown={(event) => event.stopPropagation()}>
          <button className="image-lightbox-close" type="button" onClick={() => setIsImageOpen(false)} aria-label="Close image preview"><X aria-hidden="true" /></button>
          <img src={resolveImageUrl(images[activeImage])} alt={`${project.title} screenshot ${activeImage + 1}`} />
          {hasGallery && <>
            <button className="image-lightbox-control image-lightbox-previous" type="button" onClick={showPrevious} aria-label="Previous project image"><ChevronLeft aria-hidden="true" /></button>
            <button className="image-lightbox-control image-lightbox-next" type="button" onClick={showNext} aria-label="Next project image"><ChevronRight aria-hidden="true" /></button>
            <span className="image-lightbox-count">{activeImage + 1} / {images.length}</span>
          </>}
        </section>
      </div>}
    </article>
  )
}
