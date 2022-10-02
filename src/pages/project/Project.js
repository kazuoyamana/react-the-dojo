import "./Project.css"
import { useParams } from "react-router-dom"
import { useDocument } from "../../hooks/useDocument"
import { ProjectSummary } from "./ProjectSummary"
import { ProjectComments } from "./ProjectComments"

export const Project = () => {
  const { id } = useParams()
  const { document, error, setReload } = useDocument("projects", id)
  console.log(document)

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!document) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="project-details">
      <ProjectSummary project={document} />
      <ProjectComments project={document} setReload={setReload} />
    </div>
  )
}
