import "./Dashboard.css"
import { useState } from "react"
import { ProjectList } from "../../components/ProjectList"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from "../../hooks/useCollection"
import { ProjectFilter } from "./ProjectFilter"

export const Dashboard = () => {
  const { documents, error } = useCollection("projects")
  const [currentFilter, setCurrentFilter] = useState("all")
  const { user } = useAuthContext()

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
    console.log(documents, user)
  }

  const projects = documents?.filter((doc) => {
    if (currentFilter === "all") {
      // 下記のようにdocをそのまま返しても true を返しても同じ
      return doc
    } else if (currentFilter === "mine") {
      // map()で[uid, uid, uid]のリストを作り、includes()でtrue/falseを受け取る
      return doc.assignedUsersList.map((u) => u.id).includes(user.uid)
    } else {
      // これも結局、式の結果をtrue/falseで返してるだけ
      return doc.category === currentFilter
    }
  })

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />
      )}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}
